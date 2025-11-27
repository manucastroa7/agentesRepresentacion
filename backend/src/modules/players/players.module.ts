import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayerVideo } from './entities/player-video.entity';
import { Agent } from '../agents/entities/agent.entity';
import { PlayersController } from './players.controller';
import { PublicPlayersController } from './public-players.controller';
import { PlayerVideosController } from './player-videos.controller';
import { PlayersService } from './players.service';
import { AgentsModule } from '../agents/agents.module';
import { MediaModule } from '../media/media.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Player, PlayerVideo, Agent]),
        AgentsModule,
        MediaModule,
    ],
    controllers: [PlayersController, PublicPlayersController, PlayerVideosController],
    providers: [PlayersService],
    exports: [PlayersService],
})
export class PlayersModule { }
