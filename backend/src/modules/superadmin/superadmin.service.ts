import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AgentsService } from '../agents/agents.service';
import { DemoRequestsService } from '../demo-requests/demo-requests.service';

@Injectable()
export class SuperadminService {
    constructor(
        private readonly usersService: UsersService,
        private readonly agentsService: AgentsService,
        private readonly demoRequestsService: DemoRequestsService,
    ) { }

    // Add aggregation methods here if needed, or controller can call services directly
    // For now, this service acts as a facade
}
