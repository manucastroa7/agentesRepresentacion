import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Player } from '../players/entities/player.entity';
import { Agent } from '../agents/entities/agent.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Application, Player, Agent])],
    controllers: [ApplicationsController],
    providers: [ApplicationsService],
    exports: [ApplicationsService],
})
export class ApplicationsModule { }
