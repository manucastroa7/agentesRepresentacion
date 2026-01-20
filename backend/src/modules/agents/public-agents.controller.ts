import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { PlayersService } from '../players/players.service';

@Controller('public/agents')
export class PublicAgentsController {
    constructor(
        private readonly agentsService: AgentsService,
        private readonly playersService: PlayersService,
    ) { }

    @Get()
    async findAll() {
        const agents = await this.agentsService.findAll();
        return agents.map(agent => ({
            id: agent.id,
            agencyName: agent.agencyName,
            logo: agent.logo,
            slug: agent.slug,
            location: agent.location,
            bio: agent.bio,
        }));
    }

    @Get(':slug')
    async getAgentPortfolio(@Param('slug') slug: string) {
        // Find agent by slug
        const agent = await this.agentsService.findBySlug(slug);

        if (!agent) {
            throw new NotFoundException(`Agency not found`);
        }

        // Find all signed players for this agent (public fields only)
        const players = await this.playersService.findPublicByAgent(agent.id);

        // Return public data only
        return {
            agent: {
                agencyName: agent.agencyName,
                logo: agent.logo,
                slug: agent.slug,
                contactEmail: agent.user?.email, // AgentsService includes relation user
            },
            players: players.map(player => ({
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                position: player.position,
                nationality: player.nationality,
                birthDate: player.birthDate,
                avatarUrl: player.avatarUrl,
                videoUrl: player.videoUrl,
            })),
        };
    }
}
