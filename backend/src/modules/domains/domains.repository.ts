import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from './entities/domain.entity';

@Injectable()
export class DomainsRepository {
    constructor(
        @InjectRepository(Domain)
        private readonly repo: Repository<Domain>,
    ) { }

    async create(data: Partial<Domain>): Promise<Domain> {
        const domain = this.repo.create(data);
        return this.repo.save(domain);
    }

    async findByDomain(domain: string): Promise<Domain | null> {
        return this.repo.findOne({ where: { domain } });
    }

    async findByAgentId(agentId: string): Promise<Domain | null> {
        return this.repo.findOne({ where: { agentId } });
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
