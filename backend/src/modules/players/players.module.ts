import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayerVideo } from './entities/player-video.entity';
import { Agent } from '../agents/entities/agent.entity';
import { PlayerMedia } from './entities/player-media.entity';
import { PlayersController } from './players.controller';
import { PublicPlayersController } from './public-players.controller';
import { PlayerVideosController } from './player-videos.controller';
import { PlayerMediaController } from './player-media.controller';
import { PlayersService } from './players.service';
import { AgentsModule } from '../agents/agents.module';
import { MediaModule } from '../media/media.module';

import { AgentInvitation } from '../agents/entities/agent-invitation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Player, PlayerVideo, PlayerMedia, Agent, AgentInvitation]),
        forwardRef(() => AgentsModule),
        MediaModule,
    ],
    controllers: [PlayersController, PublicPlayersController, PlayerVideosController, PlayerMediaController],
    providers: [PlayersService],
    exports: [PlayersService],
})
export class PlayersModule { }
