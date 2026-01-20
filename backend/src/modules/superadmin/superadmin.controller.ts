import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AgentsService } from '../agents/agents.service';

import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';

@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)
export class SuperadminController {
    constructor(
        private readonly superadminService: SuperadminService,
        private readonly usersService: UsersService,
        private readonly agentsService: AgentsService,
    ) { }

    @Post('users')
    async createUser(@Body() dto: CreateUserByAdminDto) {
        return this.superadminService.createUser(dto);
    }

    @Get('users')
    async getUsersByRole(@Query('role') role: UserRole) {
        return this.superadminService.findAllByRole(role);
    }

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

    @Delete('agents/:id')
    async deleteAgent(@Param('id') id: string) {
        await this.superadminService.deleteAgent(id);
        return { message: 'Agent deleted successfully' };
    }

    @Patch('agents/:id')
    async updateAgent(@Param('id') id: string, @Body() body: { agencyName?: string; email?: string; slug?: string; password?: string }) {
        return this.superadminService.updateAgent(id, body);
    }

    @Delete('players/:id')
    async deletePlayer(@Param('id') id: string) {
        await this.superadminService.deletePlayer(id);
        return { message: 'Player deleted successfully' };
    }

    @Delete('clubs/:id')
    async deleteClub(@Param('id') id: string) {
        await this.superadminService.deleteClub(id);
        return { message: 'Club deleted successfully' };
    }
}
