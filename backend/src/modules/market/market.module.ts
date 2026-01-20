import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../players/entities/player.entity';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
    imports: [TypeOrmModule.forFeature([Player])],
    controllers: [MarketController],
    providers: [MarketService],
})
export class MarketModule { }
