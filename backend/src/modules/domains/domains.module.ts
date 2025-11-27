import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { DomainsRepository } from './domains.repository';
import { AgentsModule } from '../agents/agents.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Domain]),
        AgentsModule,
    ],
    controllers: [DomainsController],
    providers: [DomainsService, DomainsRepository],
    exports: [DomainsService],
})
export class DomainsModule { }
