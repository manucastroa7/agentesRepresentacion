import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DomainsRepository } from './domains.repository';
import { Domain } from './entities/domain.entity';

@Injectable()
export class DomainsService {
    constructor(private readonly domainsRepository: DomainsRepository) { }

    async create(agentId: string, domainName: string): Promise<Domain> {
        const existing = await this.domainsRepository.findByDomain(domainName);
        if (existing) {
            throw new BadRequestException('Domain already taken');
        }
        return this.domainsRepository.create({ agentId, domain: domainName });
    }

    async findByDomain(domainName: string): Promise<Domain> {
        const domain = await this.domainsRepository.findByDomain(domainName);
        if (!domain) {
            throw new NotFoundException('Domain not found');
        }
        return domain;
    }

    async findByAgentId(agentId: string): Promise<Domain | null> {
        return this.domainsRepository.findByAgentId(agentId);
    }
}
