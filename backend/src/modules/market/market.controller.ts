import { Controller, Get, Query } from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService) { }

    @Get()
    // Endpoint público (no utiliza UseGuards con AuthGuard)
    findAll(
        @Query('position') position?: string,
        @Query('minAge') minAge?: number,
        @Query('maxAge') maxAge?: number,
        @Query('nationality') nationality?: string,
        @Query('contractStatus') contractStatus?: string,
    ) {
        return this.marketService.findAll({ position, minAge, maxAge, nationality, contractStatus });
    }
}
