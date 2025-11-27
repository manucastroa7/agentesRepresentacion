import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { AgentsModule } from '../agents/agents.module';
import { PlayersModule } from '../players/players.module';

@Module({
    imports: [AgentsModule, PlayersModule],
    controllers: [PublicController],
    providers: [PublicService],
})
export class PublicModule { }
