import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Agent, AgentPlan, AgentStatus } from './entities/agent.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Player, PlayerStatus, RepresentationStatus } from '../players/entities/player.entity';
import { AgentInvitation, InvitationStatus } from './entities/agent-invitation.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgentsService {
    constructor(
        @InjectRepository(Agent)
        private readonly agentsRepository: Repository<Agent>,
        @InjectRepository(Player)
        private readonly playersRepository: Repository<Player>,
        @InjectRepository(AgentInvitation)
        private readonly invitationRepository: Repository<AgentInvitation>,
        private readonly dataSource: DataSource,
    ) { }

    async createAgent(data: { email: string; password: string; agencyName: string }): Promise<Agent> {
        const { email, password, agencyName } = data;

        return this.dataSource.transaction(async (manager) => {
            // 1. Check if user exists
            const existingUser = await manager.findOne(User, { where: { email } });
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }

            // 2. Create User
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = manager.create(User, {
                email,
                passwordHash: hashedPassword,
                role: UserRole.AGENT,
            });
            const savedUser = await manager.save(user);

            // 3. Create Agent
            const agent = manager.create(Agent, {
                agencyName,
                slug: agencyName.toLowerCase().replace(/\s+/g, '-'), // Simple slug generation
                userId: savedUser.id,
                user: savedUser,
            });
            return manager.save(agent);
        });
    }

    async createForExistingUser(user: User, agencyName: string): Promise<Agent> {
        const agent = this.agentsRepository.create({
            agencyName,
            slug: agencyName.toLowerCase().replace(/\s+/g, '-'),
            userId: user.id,
            user: user,
            plan: AgentPlan.ENTERPRISE,
            status: AgentStatus.ACTIVE
        });
        return this.agentsRepository.save(agent);
    }

    async create(data: Partial<Agent>): Promise<Agent> {
        return this.agentsRepository.create(data);
    }

    async findByUserId(userId: string): Promise<Agent> {
        const agent = await this.agentsRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
        if (!agent) {
            throw new NotFoundException('Agent not found for this user');
        }
        return agent;
    }

    async findBySlug(slug: string): Promise<Agent> {
        const agent = await this.agentsRepository.findOne({
            where: { slug },
            relations: ['user'],
        });
        if (!agent) {
            throw new NotFoundException('Agent not found');
        }
        return agent;
    }

    async update(id: string, data: Partial<Agent>): Promise<Agent | null> {
        await this.agentsRepository.update(id, data);
        return this.agentsRepository.findOne({ where: { id } });
    }

    async updateProfile(userId: string, data: Partial<Agent>): Promise<Agent> {
        const agent = await this.findByUserId(userId);

        const allowedFields = ['phone', 'location', 'bio', 'website', 'socialLinks', 'logo'] as const;
        allowedFields.forEach((key) => {
            if (data[key] !== undefined) {
                (agent as any)[key] = data[key];
            }
        });

        return this.agentsRepository.save(agent);
    }

    async findAll(): Promise<Agent[]> {
        return this.agentsRepository.find({ relations: ['user'] });
    }

    async delete(id: string): Promise<void> {
        const agent = await this.agentsRepository.findOne({ where: { id } });
        if (!agent) {
            throw new NotFoundException('Agent not found');
        }

        await this.dataSource.transaction(async (manager) => {
            await manager.delete(Agent, id);
            if (agent.userId) {
                await manager.delete(User, agent.userId);
            }
        });
    }

    // --- Player Management ---

    async findMyPlayers(userId: string): Promise<Player[]> {
        const agent = await this.findByUserId(userId);
        return this.playersRepository.find({
            where: { agent: { id: agent.id } },
            order: { createdAt: 'DESC' }
        });
    }

    async createPlayer(userId: string, data: Partial<Player>): Promise<Player> {
        const agent = await this.findByUserId(userId);

        const player = this.playersRepository.create({
            ...data,
            agent: agent,
            agentId: agent.id,
            status: PlayerStatus.SIGNED, // Default to signed for manual creation
            isMarketplaceVisible: false, // Default hidden
        });

        return this.playersRepository.save(player);
    }

    async togglePlayerVisibility(userId: string, playerId: string): Promise<Player> {
        const agent = await this.findByUserId(userId);
        const player = await this.playersRepository.findOne({ where: { id: playerId } });

        if (!player) {
            throw new NotFoundException('Player not found');
        }

        if (player.agentId !== agent.id) {
            throw new ForbiddenException('You do not own this player profile');
        }

        player.isMarketplaceVisible = !player.isMarketplaceVisible;
        return this.playersRepository.save(player);
    }

    async checkInvitations(email: string, agent: Agent) {
        console.log(`Checking invitations for ${email}...`);
        const invitations = await this.invitationRepository.find({
            where: {
                targetEmail: email,
                status: InvitationStatus.PENDING
            },
            relations: ['player']
        });

        if (invitations.length > 0) {
            console.log(`🎉 Found ${invitations.length} pending invitations for ${email}`);

            for (const invite of invitations) {
                // 1. Accept Invitation
                invite.status = InvitationStatus.ACCEPTED;
                await this.invitationRepository.save(invite);

                // 2. Link Player
                const player = invite.player;
                if (player) {
                    player.agent = agent;
                    player.representationStatus = RepresentationStatus.PENDING_CONFIRMATION;

                    await this.playersRepository.save(player);
                    console.log(`🔗 Linked player ${player.firstName} ${player.lastName} to agent ${agent.agencyName}`);
                }
            }
        } else {
            console.log('No pending invitations found.');
        }
    }
}
