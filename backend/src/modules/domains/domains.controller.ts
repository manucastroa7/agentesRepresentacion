import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';
import { AgentsService } from '../agents/agents.service';

@Controller('domains')
export class DomainsController {
    constructor(
        private readonly domainsService: DomainsService,
        private readonly agentsService: AgentsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.AGENT)
    async create(@Request() req, @Body('domain') domain: string) {
        const agent = await this.agentsService.findByUserId(req.user.userId);
        return this.domainsService.create(agent.id, domain);
    }

    @Get('check/:domain')
    async checkAvailability(@Param('domain') domain: string) {
        try {
            await this.domainsService.findByDomain(domain);
            return { available: false };
        } catch (e) {
            return { available: true };
        }
    }
}
