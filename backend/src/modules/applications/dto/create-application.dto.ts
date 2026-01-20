import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateApplicationDto {
    @IsNotEmpty()
    @IsUUID()
    agentId: string;

    @IsOptional()
    @IsString()
    message?: string;
}
