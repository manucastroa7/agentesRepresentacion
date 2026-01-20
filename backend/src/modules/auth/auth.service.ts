import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dtos/login.dto';

import { PlayersService } from '../players/players.service';
import { AgentsService } from '../agents/agents.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly playersService: PlayersService,
        private readonly agentsService: AgentsService,
        private readonly mailService: MailService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        console.log(`Attempting login for: ${email}`);
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            console.log('User not found');
            return null;
        }
        console.log('User found. Verifying password...');
        const isMatch = await bcrypt.compare(pass, user.passwordHash);
        console.log(`Password match: ${isMatch}`);

        if (user && isMatch) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        console.log('🔐 Login - Usuario completo:', user);
        console.log('🔐 Login - Rol del usuario:', user.role);

        let additionalClaims = {};

        if (user.role === 'agent') {
            try {
                const agent = await this.agentsService.findByUserId(user.id);
                additionalClaims = {
                    agencyName: agent.agencyName,
                    slug: agent.slug,
                    avatarUrl: agent.logo
                };
            } catch (e) {
                console.warn('⚠️ Agent profile not found for user', user.id);
            }
        } else if (user.role === 'player') {
            const player = await this.playersService.findByUserId(user.id);
            if (player) {
                additionalClaims = {
                    firstName: player.firstName,
                    lastName: player.lastName,
                    avatarUrl: player.avatarUrl
                };
            }
        }

        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            ...additionalClaims
        };

        console.log('🔐 Login - Payload del JWT:', payload);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }), // TODO: Use config
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                ...additionalClaims
            },
        };
    }

    async register(data: any) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(data.password, salt);
        const newUser = await this.usersService.create({
            ...data,
            passwordHash,
        });

        if (newUser.role === 'player') {
            // Create empty player profile linked to user, passing registration data
            await this.playersService.createEmptyForUser(newUser, data);
        } else if (newUser.role === 'agent') {
            // Create agent profile for the new user
            const agencyName = data.agencyName || `Agencia de ${newUser.email}`;
            const agent = await this.agentsService.createForExistingUser(newUser, agencyName);

            // Cycle Closing: Check if this email was invited by any player
            await this.agentsService.checkInvitations(newUser.email, agent);
        }

        return newUser;
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            // For security, don't reveal if user exists
            return { message: 'Si el correo existe, se ha enviado un enlace.' };
        }

        // Generate a short-lived token for reset
        const payload = { sub: user.id, email: user.email, type: 'reset' };
        const token = this.jwtService.sign(payload, { expiresIn: '30m' });

        await this.mailService.sendPasswordResetEmail(user.email, token);
        return { message: 'Correo enviado' };
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== 'reset') {
                throw new UnauthorizedException('Token inválido');
            }

            const user = await this.usersService.findById(payload.sub);
            if (!user) throw new UnauthorizedException('Usuario no encontrado');

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(newPassword, salt);

            await this.usersService.update(user.id, { passwordHash });

            return { message: 'Contraseña actualizada correctamente' };
        } catch (error) {
            throw new UnauthorizedException('El enlace ha expirado o es inválido');
        }
    }
}
