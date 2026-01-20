import { Controller, Get, Post, Query, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('clubs')
export class ClubsController {
    constructor(private readonly clubsService: ClubsService) { }

    @Get('search')
    async search(@Query('q') query: string) {
        if (!query || query.length < 2) {
            return []; // Return empty if query is too short
        }
        return this.clubsService.search(query);
    }

    @UseGuards(JwtAuthGuard)
    @Post('propose')
    async propose(@Body('name') name: string) {
        if (!name || name.trim().length < 3) {
            throw new BadRequestException('El nombre del club es demasiado corto.');
        }
        return this.clubsService.propose(name.trim());
    }
}
