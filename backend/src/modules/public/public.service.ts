import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentsService } from '../agents/agents.service';
import { PlayersService } from '../players/players.service';

@Injectable()
export class PublicService {
    constructor(
        private readonly agentsService: AgentsService,
        private readonly playersService: PlayersService,
    ) { }

    async getAgentBySlug(slug: string) {
        return this.agentsService.findBySlug(slug);
    }

    async getAgentPlayers(slug: string) {
        const agent = await this.agentsService.findBySlug(slug);
        return this.playersService.findAll(agent.id);
    }

    async getPlayer(slug: string, playerId: string) {
        const agent = await this.agentsService.findBySlug(slug);
        return this.playersService.findOne(agent.id, playerId);
    }
}
