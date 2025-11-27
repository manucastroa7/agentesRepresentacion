import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
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
        const payload = { email: user.email, sub: user.id, role: user.role };
        console.log('🔐 Login - Payload del JWT:', payload);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }), // TODO: Use config
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    async register(data: any) {
        // Only for superadmin or initial setup
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(data.password, salt);
        return this.usersService.create({
            ...data,
            passwordHash,
        });
    }
}
