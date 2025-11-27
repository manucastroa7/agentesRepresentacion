import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Agent } from '../agents/entities/agent.entity';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
    ) { }

    // Helper privado para obtener el agente del usuario actual
    private async getAgentByUserId(userId: string): Promise<Agent> {
        const agent = await this.agentRepository.findOne({ where: { userId } });
        if (!agent) {
            console.error(`❌ Access denied: No agent profile found for userId ${userId}`);
            throw new ForbiddenException('No tienes permiso para realizar esta acción (Perfil de Agente no encontrado).');
        }

        console.log(`✅ Agent found for userId ${userId}:`, agent);
        return agent;
    }

    async create(createPlayerDto: CreatePlayerDto, userId: string): Promise<Player> {
        const agent = await this.getAgentByUserId(userId);

        const player = this.playerRepository.create({
            ...createPlayerDto,
            agent: agent, // 👈 Asignación crítica del dueño
        });

        return this.playerRepository.save(player);
    }

    async findAll(userId: string): Promise<Player[]> {
        const agent = await this.getAgentByUserId(userId);

        return this.playerRepository.find({
            where: { agent: { id: agent.id } }, // 👈 Filtro estricto por agente
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string, userId: string): Promise<Player> {
        const agent = await this.getAgentByUserId(userId);

        console.log(`🔍 findOne requesting Player ID: ${id} for Agent ID: ${agent.id}`);

        const player = await this.playerRepository.findOne({
            where: { id, agent: { id: agent.id } }, // 👈 Verificación de propiedad
            relations: ['videos']
        });

        if (!player) {
            console.error(`❌ Player not found in DB for ID: ${id} and Agent: ${agent.id}`);
            // Check if player exists at all (ignoring agent) for debugging
            const playerExists = await this.playerRepository.findOne({ where: { id } });
            if (playerExists) {
                console.error(`⚠️ Player exists but belongs to Agent: ${playerExists.agent?.id} (Current Agent: ${agent.id})`);
            } else {
                console.error(`💀 Player does not exist at all in DB.`);
            }

            throw new NotFoundException('Jugador no encontrado o no tienes permiso para verlo.');
        }

        return player;
    }

    async update(id: string, updatePlayerDto: any, userId: string): Promise<Player> {
        const agent = await this.getAgentByUserId(userId);

        // 1. Verificar que el jugador exista y pertenezca al agente
        const player = await this.findOne(id, userId);

        // 2. Actualizar
        Object.assign(player, updatePlayerDto);
        return this.playerRepository.save(player);
    }

    async remove(id: string, userId: string): Promise<void> {
        const agent = await this.getAgentByUserId(userId);

        // 1. Verificar propiedad antes de borrar
        const player = await this.findOne(id, userId);

        await this.playerRepository.remove(player);
    }

    async findOnePublic(id: string): Promise<Partial<Player>> {
        const player = await this.playerRepository.findOne({
            where: { id },
            relations: ['agent'],
            select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                nationality: true,
                birthDate: true,
                height: true,
                weight: true,
                foot: true,
                avatarUrl: true,
                videoUrl: true,
                additionalInfo: true,
                stats: true,
                agent: {
                    id: true,
                    agencyName: true,
                    // logo: true 
                }
            } as any
        });

        if (!player) {
            throw new NotFoundException('Player not found');
        }

        return player;
    }
}
