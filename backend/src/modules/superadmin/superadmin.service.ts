import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { Player } from '../players/entities/player.entity';
import { Agent } from '../agents/entities/agent.entity';
import { Club } from '../clubs/entities/club.entity';

@Injectable()
export class SuperadminService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
    ) { }

    async createUser(dto: CreateUserByAdminDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Check if user exists
            const existingUser = await queryRunner.manager.findOne(User, { where: { email: dto.email } });
            if (existingUser) {
                throw new BadRequestException('El usuario ya existe');
            }

            // 2. Create User Entity
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(dto.password, salt);

            const user = queryRunner.manager.create(User, {
                email: dto.email,
                passwordHash,
                role: dto.role,
            });

            const savedUser = await queryRunner.manager.save(user);

            // 3. Create Profile based on Role
            const profileData = dto.profileData || {};

            switch (dto.role) {
                case UserRole.PLAYER:
                    const player = queryRunner.manager.create(Player, {
                        ...profileData,
                        user: savedUser,
                        userId: savedUser.id
                    });
                    await queryRunner.manager.save(player);
                    break;

                case UserRole.AGENT:
                    // 3a. Generate Slug (Critical fix)
                    // 3a. Generate Slug from Email (User Request)
                    // e.g. "juan.perez@gmail.com" -> "juan-perez-gmail-com"
                    const slug = dto.email
                        .toLowerCase()
                        .trim()
                        .replace(/[@.]/g, '-')     // Replace @ and . with -
                        .replace(/[^\w\s-]/g, '')  // Remove other special chars
                        .replace(/[\s_-]+/g, '-')  // Collapse dashes
                        .replace(/^-+|-+$/g, '');  // Trim dashes

                    const agent = queryRunner.manager.create(Agent, {
                        ...profileData,
                        slug, // <--- Added slug
                        user: savedUser,
                        userId: savedUser.id
                    });
                    await queryRunner.manager.save(agent);
                    break;

                case UserRole.CLUB:
                    const club = queryRunner.manager.create(Club, {
                        ...profileData,
                        user: savedUser,
                        userId: savedUser.id
                    });
                    await queryRunner.manager.save(club);
                    break;

                case UserRole.SUPERADMIN:
                    // Superadmin might not need a profile, or logic can be added here
                    break;

                default:
                    throw new BadRequestException('Rol no soportado para creación de perfil');
            }

            // 4. Commit Validation
            await queryRunner.commitTransaction();

            // Return user without sensitive data
            const { passwordHash: _, ...result } = savedUser;
            return result;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error creando usuario: ' + error.message);
        } finally {
            await queryRunner.release();
        }
    }

    async findAllByRole(role: UserRole) {
        switch (role) {
            case UserRole.AGENT:
                return this.agentRepository.find({
                    relations: ['user'],
                    order: { createdAt: 'DESC' }
                });
            case UserRole.PLAYER:
                return this.playerRepository.find({
                    relations: ['user', 'agent'],
                    order: { createdAt: 'DESC' }
                });
            case UserRole.CLUB:
                return this.clubRepository.find({
                    relations: ['user'],
                    order: { createdAt: 'DESC' }
                });
            default:
                throw new BadRequestException('Rol no soportado para listado');
        }
    }
    async deleteAgent(id: string) {
        const agent = await this.agentRepository.findOne({ where: { id } });
        if (!agent) throw new BadRequestException('Agent not found');

        await this.dataSource.transaction(async (manager) => {
            await manager.delete(Agent, id);
            if (agent.userId) await manager.delete(User, agent.userId);
        });
    }

    async deletePlayer(id: string) {
        const player = await this.playerRepository.findOne({ where: { id } });
        if (!player) throw new BadRequestException('Player not found');

        await this.dataSource.transaction(async (manager) => {
            await manager.delete(Player, id);
            if (player.userId) await manager.delete(User, player.userId);
        });
    }

    async deleteClub(id: string) {
        const club = await this.clubRepository.findOne({ where: { id } });
        if (!club) throw new BadRequestException('Club not found');

        await this.dataSource.transaction(async (manager) => {
            await manager.delete(Club, id);
            if (club.userId) await manager.delete(User, club.userId);
        });
    }
    async updateAgent(id: string, data: { agencyName?: string; email?: string; slug?: string; password?: string }) {
        const agent = await this.agentRepository.findOne({ where: { id }, relations: ['user'] });
        if (!agent) throw new BadRequestException('Agent not found');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Update Agent Details
            if (data.agencyName) agent.agencyName = data.agencyName;

            if (data.slug && data.slug !== agent.slug) {
                // Check slug uniqueness
                const existingSlug = await queryRunner.manager.findOne(Agent, { where: { slug: data.slug } });
                if (existingSlug && existingSlug.id !== id) {
                    throw new BadRequestException('El nombre de usuario (slug) ya está en uso');
                }
                agent.slug = data.slug;
            }

            await queryRunner.manager.save(agent);

            // Update User Details (Email)
            if (data.email && data.email !== agent.user.email) {
                // Check uniqueness
                const existingUser = await queryRunner.manager.findOne(User, { where: { email: data.email } });
                if (existingUser) throw new BadRequestException('El email ya está en uso');

                agent.user.email = data.email;
                await queryRunner.manager.save(agent.user);
                agent.user.email = data.email;
                await queryRunner.manager.save(agent.user);
            }

            // Update Password (Manual Override)
            if (data.password) {
                const salt = await bcrypt.genSalt();
                agent.user.passwordHash = await bcrypt.hash(data.password, salt);
                await queryRunner.manager.save(agent.user);
            }

            await queryRunner.commitTransaction();
            return { ...agent, user: agent.user };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
