import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Agent, AgentPlan, AgentStatus } from './entities/agent.entity';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgentsService {
    constructor(
        @InjectRepository(Agent)
        private readonly agentsRepository: Repository<Agent>,
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
        const agent = await this.agentsRepository.findOne({ where: { userId } });
        if (!agent) {
            throw new NotFoundException('Agent not found for this user');
        }
        return agent;
    }

    async findBySlug(slug: string): Promise<Agent> {
        const agent = await this.agentsRepository.findOne({ where: { slug } });
        if (!agent) {
            throw new NotFoundException('Agent not found');
        }
        return agent;
    }

    async update(id: string, data: Partial<Agent>): Promise<Agent | null> {
        await this.agentsRepository.update(id, data);
        return this.agentsRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Agent[]> {
        return this.agentsRepository.find({ relations: ['user'] });
    }
}
