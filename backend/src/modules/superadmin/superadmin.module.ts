import { Module } from '@nestjs/common';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { UsersModule } from '../users/users.module';
import { AgentsModule } from '../agents/agents.module';
import { DemoRequestsModule } from '../demo-requests/demo-requests.module';

@Module({
    imports: [UsersModule, AgentsModule, DemoRequestsModule],
    controllers: [SuperadminController],
    providers: [SuperadminService],
})
export class SuperadminModule { }
