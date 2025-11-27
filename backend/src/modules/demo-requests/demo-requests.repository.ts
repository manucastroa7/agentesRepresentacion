import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemoRequest } from './entities/demo-request.entity';

@Injectable()
export class DemoRequestsRepository {
    constructor(
        @InjectRepository(DemoRequest)
        private readonly repo: Repository<DemoRequest>,
    ) { }

    async create(data: Partial<DemoRequest>): Promise<DemoRequest> {
        const request = this.repo.create(data);
        return this.repo.save(request);
    }

    async findAll(): Promise<DemoRequest[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findById(id: string): Promise<DemoRequest | null> {
        return this.repo.findOne({ where: { id } });
    }

    async update(id: string, data: Partial<DemoRequest>): Promise<DemoRequest | null> {
        await this.repo.update(id, data);
        return this.findById(id);
    }
}
