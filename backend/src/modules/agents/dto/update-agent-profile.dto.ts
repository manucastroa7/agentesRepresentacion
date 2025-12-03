import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinksDto {
    @IsOptional()
    @IsString()
    instagram?: string;

    @IsOptional()
    @IsString()
    linkedin?: string;

    @IsOptional()
    @IsString()
    twitter?: string;
}

export class UpdateAgentProfileDto {
    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    @IsUrl({}, { message: 'website must be a valid URL' })
    website?: string;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => SocialLinksDto)
    socialLinks?: SocialLinksDto;
}
