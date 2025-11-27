import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('players')
@UseGuards(JwtAuthGuard)
export class PlayersController {
    constructor(private readonly playersService: PlayersService) { }

    @Post()
    create(@Request() req, @Body() createPlayerDto: CreatePlayerDto) {
        console.log('🚀 POST /players called');
        console.log('👤 User ID from token:', req.user.userId);
        console.log('📦 Body:', createPlayerDto);
        // req.user.userId viene del token JWT
        const userId = req.user.id || req.user.userId;

        if (!userId) {
            console.error("🚨 ERROR CRÍTICO: No se encontró ID en el token JWT", req.user);
            throw new UnauthorizedException("Token inválido: No ID");
        }

        console.log(`🆕 Creando jugador para Usuario ID: ${userId}`);
        return this.playersService.create(createPlayerDto, userId);
    }

    @Get()
    findAll(@Request() req) {
        const userId = req.user.id || req.user.userId;
        return this.playersService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        const userId = req.user.id || req.user.userId;
        return this.playersService.findOne(id, userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePlayerDto: any, @Request() req) {
        const userId = req.user.id || req.user.userId;
        return this.playersService.update(id, updatePlayerDto, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        const userId = req.user.id || req.user.userId;
        return this.playersService.remove(id, userId);
    }
}
