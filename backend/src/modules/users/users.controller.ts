import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Patch('dashboard-config')
    async updateDashboardConfig(@Request() req, @Body() config: any) {
        const userId = req.user.id || req.user.userId;
        return this.usersService.updateDashboardConfig(userId, config);
    }
}
