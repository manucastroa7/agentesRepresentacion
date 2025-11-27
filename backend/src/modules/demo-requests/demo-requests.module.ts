import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoRequest } from './entities/demo-request.entity';
import { DemoRequestsController } from './demo-requests.controller';
import { DemoRequestsService } from './demo-requests.service';
import { DemoRequestsRepository } from './demo-requests.repository';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([DemoRequest]),
        MailModule,
    ],
    controllers: [DemoRequestsController],
    providers: [DemoRequestsService, DemoRequestsRepository],
    exports: [DemoRequestsService]
})
export class DemoRequestsModule { }
