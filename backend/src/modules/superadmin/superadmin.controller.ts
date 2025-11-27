import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AgentsService } from '../agents/agents.service';

@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)
export class SuperadminController {
    constructor(
        private readonly superadminService: SuperadminService,
        private readonly usersService: UsersService,
        private readonly agentsService: AgentsService,
    ) { }

    @Post('agents')
    async createAgent(@Body() data: any) {
        // TODO: Implement full agent creation flow (User + Agent)
        return { message: 'Agent creation not implemented yet' };
    }

    @Get('stats')
    async getStats() {
        return {
            message: 'Stats placeholder',
        };
    }
}
