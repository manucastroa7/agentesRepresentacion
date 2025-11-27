import { Injectable, NotFoundException } from '@nestjs/common';
import { DemoRequestsRepository } from './demo-requests.repository';
import { DemoRequest } from './entities/demo-request.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class DemoRequestsService {
    constructor(
        private readonly demoRequestsRepository: DemoRequestsRepository,
        private readonly mailService: MailService,
    ) { }

    async create(data: Partial<DemoRequest>): Promise<DemoRequest> {
        const request = await this.demoRequestsRepository.create(data);
        if (request.email) {
            await this.mailService.sendDemoRequestConfirmation(request.email);
        }
        return request;
    }

    async findAll(): Promise<DemoRequest[]> {
        return this.demoRequestsRepository.findAll();
    }

    async update(id: string, data: Partial<DemoRequest>): Promise<DemoRequest> {
        const request = await this.demoRequestsRepository.update(id, data);
        if (!request) {
            throw new NotFoundException('Demo request not found');
        }
        return request;
    }
}
