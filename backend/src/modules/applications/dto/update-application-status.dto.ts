import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApplicationStatus } from '../entities/application.entity';

export class UpdateApplicationStatusDto {
    @IsNotEmpty()
    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;
}
