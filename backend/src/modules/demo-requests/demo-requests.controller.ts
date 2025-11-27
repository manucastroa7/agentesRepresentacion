import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { DemoRequestsService } from './demo-requests.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';

@Controller('demo-requests')
export class DemoRequestsController {
    constructor(private readonly demoRequestsService: DemoRequestsService) { }

    @Post()
    async create(@Body() data: any) {
        return this.demoRequestsService.create(data);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    async findAll() {
        return this.demoRequestsService.findAll();
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    async update(@Param('id') id: string, @Body() data: any) {
        return this.demoRequestsService.update(id, data);
    }
}
