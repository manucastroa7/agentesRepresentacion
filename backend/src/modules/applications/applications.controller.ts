import { Controller, Post, Get, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) { }

    @Post()
    @Roles(UserRole.PLAYER)
    async create(@Request() req, @Body() createDto: CreateApplicationDto) {
        return this.applicationsService.create(req.user.id, createDto);
    }

    @Get('my')
    @Roles(UserRole.PLAYER)
    async findAllForPlayer(@Request() req) {
        return this.applicationsService.findAllForPlayer(req.user.id);
    }

    @Get('incoming')
    @Roles(UserRole.AGENT)
    async findAllForAgent(@Request() req) {
        return this.applicationsService.findAllForAgent(req.user.id);
    }

    @Patch(':id/status')
    @Roles(UserRole.AGENT)
    async updateStatus(
        @Request() req,
        @Param('id') id: string,
        @Body() updateDto: UpdateApplicationStatusDto,
    ) {
        return this.applicationsService.updateStatus(req.user.id, id, updateDto.status);
    }
}
