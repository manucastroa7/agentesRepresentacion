import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    firstName?: string;

    @IsOptional()
    lastName?: string;

    @IsOptional()
    @IsEnum(['FREE', 'REPRESENTED'])
    representationMode?: 'FREE' | 'REPRESENTED';

    @IsOptional()
    agentData?: {
        id?: string;
        email?: string;
        name?: string;
    };
}
