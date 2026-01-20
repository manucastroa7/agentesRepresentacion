import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../players/entities/player.entity';
import { PublicPlayerCardDto } from './dto/public-player-card.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MarketService {
    constructor(
        @InjectRepository(Player)
        private playerRepository: Repository<Player>,
    ) { }

    async findAll(filters: { position?: string; minAge?: number; maxAge?: number; nationality?: string; contractStatus?: string }): Promise<PublicPlayerCardDto[]> {
        const query = this.playerRepository.createQueryBuilder('player');

        // Join agent to get agencyName
        query.leftJoinAndSelect('player.agent', 'agent');

        // Only visible in marketplace
        query.where('player.isMarketplaceVisible = :visible', { visible: true });

        if (filters.position) {
            query.andWhere('player.position = :position', { position: filters.position });
        }

        if (filters.nationality) {
            query.andWhere('player.nationality = :nationality', { nationality: filters.nationality });
        }

        if (filters.contractStatus) {
            query.andWhere('player.contractStatus = :contractStatus', { contractStatus: filters.contractStatus });
        }

        if (filters.minAge) {
            const maxBirthDate = new Date();
            maxBirthDate.setFullYear(maxBirthDate.getFullYear() - Number(filters.minAge));
            query.andWhere('player.birthDate <= :maxBirthDate', { maxBirthDate });
        }

        if (filters.maxAge) {
            const minBirthDate = new Date();
            minBirthDate.setFullYear(minBirthDate.getFullYear() - Number(filters.maxAge) - 1);
            query.andWhere('player.birthDate > :minBirthDate', { minBirthDate });
        }

        const players = await query.getMany();

        return players.map(player => plainToInstance(PublicPlayerCardDto, player, { excludeExtraneousValues: true }));
    }
}
