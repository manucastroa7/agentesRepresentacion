import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AgentsService } from '../agents/agents.service';
import { UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedingService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeedingService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly agentsService: AgentsService
    ) { }

    async onApplicationBootstrap() {
        await this.seedSuperAdmin();
    }

    private async seedSuperAdmin() {
        const email = 'agentesrepresentacion@gmail.com';
        const passwordRaw = 'Admin123!';

        // 1. Encriptamos la contraseña AQUÍ
        const hashedPassword = await bcrypt.hash(passwordRaw, 10);

        // 2. Buscamos si ya existe
        let user = await this.usersService.findByEmail(email);

        if (!user) {
            this.logger.log('🚀 Creando usuario SuperAdmin...');

            // IMPORTANTE: Asegúrate de que tu usersService.create acepte 'passwordHash'
            // y NO vuelva a encriptar dentro.
            user = await this.usersService.create({
                email,
                passwordHash: hashedPassword,
                role: UserRole.SUPERADMIN,
            });

            this.logger.log('✅ SuperAdmin creado: ' + email);
        } else {
            this.logger.log('🔄 El usuario SuperAdmin ya existe. Actualizando contraseña...');

            // Si tu UsersService tiene un método update, úsalo. 
            // Si no, asumimos que usas TypeORM repository directamente en el servicio.
            // Esta línea asegura que si cambiaste la lógica de hash, se arregle ahora.

            // Opción A: Si tienes un método update en UsersService (Recomendado)
            if (this.usersService.update) {
                await this.usersService.update(user.id, { passwordHash: hashedPassword });
                this.logger.log('✅ Contraseña de SuperAdmin restablecida a: ' + passwordRaw);
            } else {
                this.logger.warn('⚠️ No se pudo actualizar la contraseña automáticamente. Si no puedes entrar, borra el usuario de la DB manualmente y reinicia.');
            }
        }

        // 3. Verificar si tiene perfil de Agente
        try {
            await this.agentsService.findByUserId(user.id);
            this.logger.log('✅ El SuperAdmin ya tiene perfil de Agente.');
        } catch (error) {
            this.logger.log('🚀 Creando perfil de Agente para SuperAdmin...');
            await this.agentsService.createForExistingUser(user, 'SuperAdmin Agency');
            this.logger.log('✅ Perfil de Agente creado para SuperAdmin.');
        }
    }
}