import { Body, Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PlayersService } from './players.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class PlayerMediaController {
    constructor(private readonly playersService: PlayersService) { }

    @Post('players/:id/media')
    async addMedia(
        @Request() req,
        @Param('id') playerId: string,
        @Body() body: { type: 'image' | 'video'; url: string; title?: string },
    ) {
        const userId = req.user.id || req.user.userId;
        return this.playersService.addMedia(userId, playerId, body);
    }

    @Delete('media/:mediaId')
    async deleteMedia(@Request() req, @Param('mediaId') mediaId: string) {
        const userId = req.user.id || req.user.userId;
        return this.playersService.removeMedia(userId, mediaId);
    }
}
