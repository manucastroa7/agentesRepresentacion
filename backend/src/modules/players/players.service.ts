import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player, PlayerStatus, RepresentationStatus } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Agent } from '../agents/entities/agent.entity';
import { AgentInvitation, InvitationStatus } from '../agents/entities/agent-invitation.entity';
import { PlayerMedia } from './entities/player-media.entity';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
        @InjectRepository(PlayerMedia)
        private readonly playerMediaRepository: Repository<PlayerMedia>,
        @InjectRepository(AgentInvitation)
        private readonly invitationRepository: Repository<AgentInvitation>,
    ) { }

    // Helper privado para obtener el agente del usuario actual
    private async getAgentByUserId(userId: string): Promise<Agent> {
        const agent = await this.agentRepository.findOne({ where: { userId } });
        if (!agent) {
            console.error(`🚫 Access denied: No agent profile found for userId ${userId}`);
            throw new ForbiddenException('No tienes permiso para realizar esta acción (Perfil de Agente no encontrado).');
        }

        console.log(`✅ Agent found for userId ${userId}:`, agent);
        return agent;
    }

    async findByUserId(userId: string): Promise<Player | null> {
        return this.playerRepository.findOne({ where: { userId } });
    }

    async create(createPlayerDto: CreatePlayerDto, userId: string): Promise<Player> {
        const agent = await this.getAgentByUserId(userId);
        const status = createPlayerDto.status ?? PlayerStatus.SIGNED;

        console.log('🆕 Creating new player:');
        console.log('   - DTO status:', createPlayerDto.status);
        console.log('   - Final status:', status);
        console.log('   - Agent ID:', agent.id);

        // Exclude media from DTO as it's handled separately via addMedia method
        const { media, ...playerData } = createPlayerDto;

        const player = this.playerRepository.create({
            ...playerData,
            status,
            agent,
        });

        const savedPlayer = await this.playerRepository.save(player);

        console.log('✅ Player saved successfully:');
        console.log('   - Player ID:', savedPlayer.id);
        console.log('   - Status in DB:', savedPlayer.status);
        console.log('   - Agent ID:', savedPlayer.agentId);

        return savedPlayer;
    }

    async createEmptyForUser(user: any, registrationData?: any): Promise<Player> {
        const player = this.playerRepository.create({
            firstName: user.firstName || 'Nuevo',
            lastName: user.lastName || 'Jugador',
            position: ['Sin definir'],
            status: PlayerStatus.SIGNED,
            user: user,
            userId: user.id,
            representationStatus: RepresentationStatus.FREE_AGENT // Default
        });

        // Advanced Logic for Representation
        if (registrationData?.representationMode === 'REPRESENTED') {
            const agentData = registrationData.agentData;

            // CASO B: Agente ya registrado (Selected from search)
            if (agentData?.id) {
                const agent = await this.agentRepository.findOne({ where: { id: agentData.id } });
                if (agent) {
                    player.agent = agent;
                    player.representationStatus = RepresentationStatus.PENDING_CONFIRMATION;
                    console.log(`🔗 Player ${user.email} linked to existing agent ${agent.agencyName} (Pending Confirmation)`);
                }
            }
            // CASO C: Agente NO registrado (Invitation)
            else if (agentData?.email) {
                player.representationStatus = RepresentationStatus.PENDING_INVITATION;

                // Create Invitation
                const invitation = this.invitationRepository.create({
                    targetEmail: agentData.email,
                    targetName: agentData.name || 'Agente',
                    player: player, // Will be linked after player save or we save player first? 
                    // Player needs to be saved first for ID, or cascade. 
                    // Let's save player first below, then invitation.
                    token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                    status: InvitationStatus.PENDING
                });

                // We'll save invitation after player save
                console.log(`📧 Invitation prepared for ${agentData.email}`);

                // MOCK EMAIL SERVICE
                console.log(`
                ---------------------------------------------------------
                [MOCK EMAIL SERVICE] Sending Invitation
                To: ${agentData.email}
                Subject: Invitación de ${user.firstName || 'Jugador'}
                Body: Hola ${agentData.name}, tu jugador te ha invitado a unirte a la plataforma.
                Link: https://app.agentes.com/register?token=${invitation.token}
                ---------------------------------------------------------
                `);

                // Store invitation in a variable to save later or rely on logical check
                // Since 'player' is not saved yet, we wait.
                // We can't attach it to 'player' entity directly unless we add OneToMany relation.
                // We'll fetch the saved player ID.
                (player as any).__pendingInvitation = invitation;
            }
        }

        const savedPlayer = await this.playerRepository.save(player);

        // Save pending invitation if exists
        if ((player as any).__pendingInvitation) {
            const invitation = (player as any).__pendingInvitation;
            invitation.player = savedPlayer;
            invitation.playerId = savedPlayer.id;
            await this.invitationRepository.save(invitation);
        }

        return savedPlayer;
    }

    async findAll(userId: string): Promise<Player[]> {
        const agent = await this.getAgentByUserId(userId);

        return this.playerRepository.find({
            where: { agent: { id: agent.id } },
            relations: ['media', 'videos'],
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string, userId: string): Promise<Player> {
        const agent = await this.getAgentByUserId(userId);

        console.log(`🔎 findOne requesting Player ID: ${id} for Agent ID: ${agent.id}`);

        const player = await this.playerRepository.findOne({
            where: { id, agent: { id: agent.id } },
            relations: ['videos', 'media']
        });

        if (!player) {
            console.error(`❌ Player not found in DB for ID: ${id} and Agent: ${agent.id}`);
            const playerExists = await this.playerRepository.findOne({ where: { id } });
            if (playerExists) {
                console.error(`⚠️ Player exists but belongs to Agent: ${playerExists.agent?.id} (Current Agent: ${agent.id})`);
            } else {
                console.error(`🔍 Player does not exist at all in DB.`);
            }

            throw new NotFoundException('Jugador no encontrado o no tienes permiso para verlo.');
        }

        return player;
    }

    async update(id: string, updatePlayerDto: any, userId: string): Promise<Player> {
        await this.getAgentByUserId(userId);

        const player = await this.findOne(id, userId);

        Object.assign(player, updatePlayerDto);
        return this.playerRepository.save(player);
    }

    async addMedia(userId: string, playerId: string, data: { type: 'image' | 'video'; url: string; title?: string }) {
        const agent = await this.getAgentByUserId(userId);
        const player = await this.playerRepository.findOne({
            where: { id: playerId, agent: { id: agent.id } }
        });
        if (!player) {
            throw new NotFoundException('Jugador no encontrado');
        }
        const media = this.playerMediaRepository.create({
            ...data,
            player,
        });
        return this.playerMediaRepository.save(media);
    }

    async removeMedia(userId: string, mediaId: string) {
        const agent = await this.getAgentByUserId(userId);
        const media = await this.playerMediaRepository.findOne({
            where: { id: mediaId },
            relations: ['player'],
        });
        if (!media) throw new NotFoundException('Media no encontrada');
        if (media.player.agentId !== agent.id) {
            throw new ForbiddenException('No tienes permiso para eliminar este media');
        }
        await this.playerMediaRepository.delete(mediaId);
        return { message: 'Media eliminada' };
    }


    async remove(id: string, userId: string): Promise<void> {
        console.log('🗑️  DELETE request for player:', id);
        console.log('   - User ID:', userId);

        const agent = await this.getAgentByUserId(userId);
        console.log('   - Agent ID:', agent.id);

        const player = await this.findOne(id, userId);
        console.log('   - Player found:', player.firstName, player.lastName);
        console.log('   - About to remove from database...');

        await this.playerRepository.remove(player);
        console.log('✅ Player successfully deleted from database');
    }

    // Jugadores visibles publicamente (solo firmados) para un agente
    async findPublicByAgent(agentId: string): Promise<Partial<Player>[]> {
        console.log('🔍 Finding public players for agent:', agentId);
        console.log('   - Filtering by status:', PlayerStatus.SIGNED);

        const players = await this.playerRepository.find({
            where: { agentId, status: PlayerStatus.SIGNED, isMarketplaceVisible: true },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                nationality: true,
                birthDate: true,
                avatarUrl: true,
                videoUrl: true,
                passport: true,
                createdAt: true,
            } as any,
            order: { createdAt: 'DESC' }
        });

        console.log(`✅ Found ${players.length} public players`);

        // Let's also check ALL players for this agent to see status distribution
        const allPlayers = await this.playerRepository.find({
            where: { agentId },
            select: { id: true, firstName: true, lastName: true, status: true } as any
        });
        console.log('📊 Status distribution for all players:');
        allPlayers.forEach(p => {
            console.log(`   - ${p.firstName} ${p.lastName}: ${p.status}`);
        });

        return players;
    }

    async findOnePublic(id: string): Promise<Partial<Player>> {
        const player = await this.playerRepository.findOne({
            where: {
                id,
                status: PlayerStatus.SIGNED,
                isMarketplaceVisible: true
            },
            relations: ['agent', 'media'],
            select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                nationality: true,
                birthDate: true,
                height: true,
                weight: true,
                foot: true,
                avatarUrl: true,
                videoUrl: true,
                passport: true,
                videoList: true,
                additionalInfo: true,
                careerHistory: true,
                showCareerHistory: true,
                tacticalPoints: true,
                stats: true,
                agent: {
                    id: true,
                    agencyName: true,
                    logo: true,
                }
            } as any,
        });

        if (!player) {
            throw new NotFoundException('Player not found');
        }

        return player;
    }

    // Detalle publico validando pertenencia al agente
    async findOnePublicByAgent(playerId: string, agentId: string): Promise<Partial<Player>> {
        const player = await this.playerRepository.findOne({
            where: {
                id: playerId,
                agentId,
                status: PlayerStatus.SIGNED,
                isMarketplaceVisible: true
            },
            relations: ['agent', 'media'],
            select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                nationality: true,
                birthDate: true,
                height: true,
                weight: true,
                foot: true,
                avatarUrl: true,
                videoUrl: true,
                passport: true,
                videoList: true,
                additionalInfo: true,
                careerHistory: true,
                showCareerHistory: true,
                tacticalPoints: true,
                stats: true,
                agent: {
                    id: true,
                    agencyName: true,
                    logo: true,
                }
            } as any,
        });

        if (!player) {
            throw new NotFoundException('Player not found');
        }

        return player;
    }

    async findAllMarket(): Promise<Partial<Player>[]> {
        console.log('🌍 Finding all players for Global Market');

        // DEBUG: Check all players
        const allPlayers = await this.playerRepository.find({ select: ['id', 'firstName', 'status', 'isMarketplaceVisible'] });
        console.log(`📊 TOTAL PLAYERS IN DB: ${allPlayers.length}`);
        allPlayers.forEach(p => console.log(`   - ${p.firstName}: Status=${p.status}, Visible=${p.isMarketplaceVisible}`));

        const players = await this.playerRepository.find({
            where: { status: PlayerStatus.SIGNED, isMarketplaceVisible: true },
            relations: ['agent'],
            select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                nationality: true,
                birthDate: true,
                height: true,
                weight: true,
                foot: true,
                avatarUrl: true,
                videoUrl: true,
                club: true,
                contractStatus: true,
                marketValue: true,
                agent: {
                    id: true,
                    agencyName: true,
                    logo: true
                }
            } as any,
            order: { createdAt: 'DESC' }
        });

        console.log(`✅ Found ${players.length} players for market`);
        return players;
    }

    async fixAgencyData() {
        // 1. Delete the empty duplicate agency
        const duplicateAgencyId = '6addec02-2703-4df1-9360-91ae92c27a94';
        const duplicateAgency = await this.agentRepository.findOne({ where: { id: duplicateAgencyId } });

        if (duplicateAgency) {
            console.log('🗑️ Deleting duplicate agency:', duplicateAgency.agencyName);
            await this.agentRepository.remove(duplicateAgency);
        } else {
            console.log('⚠️ Duplicate agency not found (maybe already deleted)');
        }

        // 2. Rename the active agency
        const activeAgencyId = 'f5cc4232-6852-4df2-8555-d0d7c7602a6a';
        const activeAgency = await this.agentRepository.findOne({ where: { id: activeAgencyId } });

        if (activeAgency) {
            console.log('✏️ Renaming active agency:', activeAgency.agencyName);
            activeAgency.agencyName = 'Josefina Deportes';
            activeAgency.slug = 'josefina-deportes';
            await this.agentRepository.save(activeAgency);
            console.log('✅ Agency renamed successfully');
            return { success: true, message: 'Agency fixed' };
        }

        return { success: false, message: 'Active agency not found' };
    }
}
