import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Club } from './entities/club.entity';
import { ClubCatalog } from './entities/club-catalog.entity';

@Injectable()
export class ClubsService {
    constructor(
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
        @InjectRepository(ClubCatalog)
        private readonly clubCatalogRepository: Repository<ClubCatalog>,
    ) { }

    async findByUserId(userId: string): Promise<Club | null> {
        return this.clubRepository.findOne({ where: { userId } });
    }

    async search(query: string): Promise<ClubCatalog[]> {
        if (!query) return [];
        return this.clubCatalogRepository.find({
            where: [
                { officialName: ILike(`%${query}%`) },
                { shortName: ILike(`%${query}%`) }
            ],
            take: 10,
            order: { isVerified: 'DESC', officialName: 'ASC' }
        });
    }

    async propose(name: string): Promise<ClubCatalog> {
        // 1. Exact match check
        const exactMatch = await this.clubCatalogRepository.findOne({
            where: { officialName: ILike(name) }
        });
        if (exactMatch) {
            throw new ConflictException(`El club "${exactMatch.officialName}" ya existe.`);
        }

        // 2. Similarity check (Simple implementation)
        // Fetch clubs that share at least 3 characters (to limit the set) or just fetch all verified ones if the list is small.
        // For scalability, we should use Full Text Search or Trigram, but here we'll use a broad ILike and then JS filter.
        const potentialMatches = await this.clubCatalogRepository.find({
            where: { officialName: ILike(`%${name.substring(0, 3)}%`) }, // Optimization: match first 3 chars
            take: 50
        });

        const duplicates = potentialMatches.filter(c => this.calculateSimilarity(name, c.officialName) > 0.8);

        if (duplicates.length > 0) {
            const names = duplicates.map(d => d.officialName).join(', ');
            throw new ConflictException(`Posible duplicado de: ${names}`);
        }

        // 3. Create unverified club
        const newClub = this.clubCatalogRepository.create({
            officialName: name,
            isVerified: false
        });

        return this.clubCatalogRepository.save(newClub);
    }

    private calculateSimilarity(s1: string, s2: string): number {
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        const longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength.toString());
    }

    private editDistance(s1: string, s2: string): number {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        const costs = new Array();
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i == 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }
}
