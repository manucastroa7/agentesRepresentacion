import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';

@Injectable()
export class AgentsRepository {
    constructor(
        @InjectRepository(Agent)
        private readonly repo: Repository<Agent>,
    ) { }

    async create(data: Partial<Agent>): Promise<Agent> {
        const agent = this.repo.create(data);
        return this.repo.save(agent);
    }

    async findByUserId(userId: string): Promise<Agent | null> {
        return this.repo.findOne({ where: { userId } });
    }

    async findBySlug(slug: string): Promise<Agent | null> {
        return this.repo.findOne({ where: { slug } });
    }

    async findById(id: string): Promise<Agent | null> {
        return this.repo.findOne({ where: { id } });
    }

    async update(id: string, data: Partial<Agent>): Promise<Agent | null> {
        await this.repo.update(id, data);
        return this.findById(id);
    }
}
