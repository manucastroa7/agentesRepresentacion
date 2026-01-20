import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { PublicAgentsController } from './public-agents.controller';
import { Player } from '../players/entities/player.entity';
import { PlayersModule } from '../players/players.module';

import { AgentInvitation } from './entities/agent-invitation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Agent, Player, AgentInvitation]),
        forwardRef(() => PlayersModule),
    ],
    controllers: [AgentsController, PublicAgentsController],
    providers: [AgentsService],
    exports: [AgentsService],
})
export class AgentsModule { }
