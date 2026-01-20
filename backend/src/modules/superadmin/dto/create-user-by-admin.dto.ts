import { IsEmail, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../users/entities/user.entity';

export class CreateUserByAdminDto {
    @IsEmail({}, { message: 'El email debe ser válido' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsEnum(UserRole, { message: 'Rol inválido' })
    role: UserRole;

    @IsObject()
    @IsNotEmpty()
    profileData: Record<string, any>;
}
