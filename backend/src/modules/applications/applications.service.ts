import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Player } from '../players/entities/player.entity';
import { Agent } from '../agents/entities/agent.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
    ) { }

    // 1. Crear solicitud (Jugador -> Agente)
    async create(userId: string, createDto: CreateApplicationDto): Promise<Application> {
        // Buscar el perfil de Jugador del usuario
        const player = await this.playerRepository.findOne({ where: { userId } });
        if (!player) {
            throw new NotFoundException('No se encontró un perfil de Jugador para este usuario.');
        }

        // Verificar si el agente existe
        const agent = await this.agentRepository.findOne({ where: { id: createDto.agentId } });
        if (!agent) {
            throw new NotFoundException('El Agente especificado no existe.');
        }

        // Verificar si ya existe una solicitud pendiente o aceptada
        const existingApp = await this.applicationRepository.findOne({
            where: {
                playerId: player.id,
                agentId: agent.id,
            }
        });

        if (existingApp) {
            if (existingApp.status === ApplicationStatus.PENDING) {
                throw new ConflictException('Ya tienes una solicitud pendiente con este agente.');
            }
            if (existingApp.status === ApplicationStatus.ACCEPTED) {
                throw new ConflictException('Ya estás representado por este agente.');
            }
        }

        // Crear la solicitud
        const application = this.applicationRepository.create({
            player,
            agent,
            message: createDto.message,
            status: ApplicationStatus.PENDING,
        });

        return this.applicationRepository.save(application);
    }

    // 2. Ver mis solicitudes enviadas (Jugador)
    async findAllForPlayer(userId: string): Promise<Application[]> {
        const player = await this.playerRepository.findOne({ where: { userId } });
        if (!player) {
            throw new NotFoundException('Perfil de jugador no encontrado.');
        }

        return this.applicationRepository.find({
            where: { playerId: player.id },
            relations: ['agent'],
            order: { createdAt: 'DESC' }
        });
    }

    // 3. Ver solicitudes recibidas (Agente)
    async findAllForAgent(userId: string): Promise<Application[]> {
        const agent = await this.agentRepository.findOne({ where: { userId } });
        if (!agent) {
            throw new NotFoundException('Perfil de agente no encontrado.');
        }

        return this.applicationRepository.find({
            where: { agentId: agent.id, status: ApplicationStatus.PENDING },
            relations: ['player'], // Incluimos info del jugador
            order: { createdAt: 'DESC' }
        });
    }

    // 4. Responder solicitud (Agente)
    async updateStatus(userId: string, applicationId: string, status: ApplicationStatus): Promise<Application> {
        const agent = await this.agentRepository.findOne({ where: { userId } });
        if (!agent) {
            throw new NotFoundException('Perfil de agente no encontrado.');
        }

        const application = await this.applicationRepository.findOne({
            where: { id: applicationId, agentId: agent.id },
            relations: ['player']
        });

        if (!application) {
            throw new NotFoundException('Solicitud no encontrada.');
        }

        application.status = status;
        const savedApp = await this.applicationRepository.save(application);

        // Si se acepta, vincular el jugador al agente
        if (status === ApplicationStatus.ACCEPTED) {
            application.player.agent = agent;
            // Opcional: Cambiar estado del jugador a 'Represented' si existiera ese estado, 
            // o simplemente asignar el agente.
            await this.playerRepository.save(application.player);
        }

        return savedApp;
    }
}
