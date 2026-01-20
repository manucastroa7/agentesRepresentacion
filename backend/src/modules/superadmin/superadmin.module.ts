import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperadminService } from './superadmin.service';
import { SuperadminController } from './superadmin.controller';
import { UsersModule } from '../users/users.module';
import { AgentsModule } from '../agents/agents.module';
import { DemoRequestsModule } from '../demo-requests/demo-requests.module';
import { User } from '../users/entities/user.entity';
import { Agent } from '../agents/entities/agent.entity';
import { Player } from '../players/entities/player.entity';
import { Club } from '../clubs/entities/club.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Agent, Player, Club]),
        UsersModule,
        AgentsModule,
        DemoRequestsModule
    ],
    controllers: [SuperadminController],
    providers: [SuperadminService],
})
export class SuperadminModule { }
