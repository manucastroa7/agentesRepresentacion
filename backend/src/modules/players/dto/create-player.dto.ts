import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsDateString, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PlayerStatus } from '../entities/player.entity';

export class CreatePlayerDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    position: string[];

    @IsArray()
    @IsOptional()
    careerHistory?: Array<{ club: string, year: string }>;

    @IsBoolean()
    @IsOptional()
    showCareerHistory?: boolean;

    @IsArray()
    @IsOptional()
    tacticalPoints?: Array<{ x: number, y: number, label?: string }>;

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
    videoList?: { url: string; title?: string }[];

    @IsArray()
    @IsOptional()
    additionalInfo?: Array<{ label: string, value: string }>;

    @IsOptional()
    stats?: any; // JSONB object

    @IsEnum(PlayerStatus)
    @IsOptional()
    status?: PlayerStatus;

    @IsOptional()
    privateDetails?: any; // Private CRM data (flexible JSONB object)
}
