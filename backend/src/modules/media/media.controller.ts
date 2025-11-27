import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Post('upload')
    @Roles(UserRole.AGENT)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: any) {
        return this.mediaService.uploadFile(file);
    }

    @Delete(':publicId')
    @Roles(UserRole.AGENT)
    async deleteFile(@Param('publicId') publicId: string) {
        return this.mediaService.deleteFile(publicId);
    }
}
