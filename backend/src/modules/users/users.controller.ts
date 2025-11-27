import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // TODO: Add Guards (JwtAuthGuard, RolesGuard) later when AuthModule is ready
    @Get('profile')
    getProfile() {
        return { message: 'User profile' };
    }
}
