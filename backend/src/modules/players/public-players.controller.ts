import { Controller, Get, Param } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('public/players')
export class PublicPlayersController {
    constructor(private readonly playersService: PlayersService) { }

    @Get()
    findAll() {
        return this.playersService.findAllMarket();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.playersService.findOnePublic(id);
    }

    @Get('debug/fix-agency')
    async fixAgency() {
        return this.playersService.fixAgencyData();
    }
}
