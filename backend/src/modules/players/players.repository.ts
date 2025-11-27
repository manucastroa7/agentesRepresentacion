import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersRepository {
    constructor(
        @InjectRepository(Player)
        private readonly repo: Repository<Player>,
    ) { }

    async create(data: Partial<Player>): Promise<Player> {
        const player = this.repo.create(data);
        return this.repo.save(player);
    }

    async findByAgentId(agentId: string): Promise<Player[]> {
        return this.repo.find({ where: { agentId } });
    }

    async findOneByAgentId(id: string, agentId: string): Promise<Player | null> {
        return this.repo.findOne({ where: { id, agentId } });
    }

    async update(id: string, data: Partial<Player>): Promise<Player | null> {
        await this.repo.update(id, data);
        return this.repo.findOne({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
