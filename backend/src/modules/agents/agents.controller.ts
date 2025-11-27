import { Controller, Get, Post, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';

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

    @Get('me')
    @Roles(UserRole.AGENT)
    async getMyAgency(@Request() req) {
        return this.agentsService.findByUserId(req.user.userId);
    }

    @Patch('me')
    @Roles(UserRole.AGENT)
    async updateMyAgency(@Request() req, @Body() data: any) {
        const agent = await this.agentsService.findByUserId(req.user.userId);
        return this.agentsService.update(agent.id, data);
    }
}
