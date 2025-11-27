import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PlayerStatus } from '../entities/player.entity';

export class CreatePlayerDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    position: string;

    @IsString()
    @IsOptional()
    nationality?: string;

    @IsString()
    @IsOptional()
    foot?: string;

    @IsNumber()
    @IsOptional()
    height?: number;

    @IsNumber()
    @IsOptional()
    weight?: number;

    @IsDateString()
    @IsNotEmpty()
    birthDate: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @IsArray()
    @IsOptional()
    media?: string[];

    @IsString()
    @IsOptional()
    videoUrl?: string;

    @IsArray()
    @IsOptional()
    additionalInfo?: Array<{ label: string, value: string }>;

    @IsOptional()
    stats?: any; // JSONB object

    @IsEnum(PlayerStatus)
    @IsOptional()
    status?: PlayerStatus;
}
