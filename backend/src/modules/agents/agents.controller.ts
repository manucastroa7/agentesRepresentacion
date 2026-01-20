import { Controller, Get, Post, Body, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';
import { UpdateAgentProfileDto } from './dto/update-agent-profile.dto';

@Controller('agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgentsController {
    constructor(private readonly agentsService: AgentsService) { }

    @Post()
    @Roles(UserRole.SUPERADMIN)
    async create(@Body() data: any) {
        return this.agentsService.createAgent(data);
    }

    @Get()
    @Roles(UserRole.SUPERADMIN)
    async findAll() {
        return this.agentsService.findAll();
    }

    @Get('profile')
    @Roles(UserRole.AGENT, UserRole.SUPERADMIN)
    async getMyProfile(@Request() req) {
        const userId = req.user.id || req.user.userId;
        return this.agentsService.findByUserId(userId);
    }

    @Patch('profile')
    @Roles(UserRole.AGENT, UserRole.SUPERADMIN)
    async updateMyProfile(@Request() req, @Body() data: UpdateAgentProfileDto) {
        const userId = req.user.id || req.user.userId;
        return this.agentsService.updateProfile(userId, data);
    }

    @Get('me')
    @Roles(UserRole.AGENT)
    async getMyAgency(@Request() req) {
        const userId = req.user.id || req.user.userId;
        return this.agentsService.findByUserId(userId);
    }

    @Get('my-players')
    @Roles(UserRole.AGENT)
    async getMyPlayers(@Request() req) {
        const userId = req.user.id || req.user.userId;
        return this.agentsService.findMyPlayers(userId);
    }

    @Post('players')
    @Roles(UserRole.AGENT)
    async createPlayer(@Request() req, @Body() data: any) {
        const userId = req.user.id || req.user.userId;
        return this.agentsService.createPlayer(userId, data);
    }

    @Patch('players/:id/visibility')
    @Roles(UserRole.AGENT)
    async togglePlayerVisibility(@Request() req, @Param('id') playerId: string) {
        const userId = req.user.id || req.user.userId;
        return this.agentsService.togglePlayerVisibility(userId, playerId);
    }

    @Patch('me')
    @Roles(UserRole.AGENT)
    async updateMyAgency(@Request() req, @Body() data: any) {
        const userId = req.user.id || req.user.userId;
        const agent = await this.agentsService.findByUserId(userId);
        return this.agentsService.update(agent.id, data);
    }
}
