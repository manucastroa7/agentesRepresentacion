import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class MediaService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadVideo(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: 'agent-sport/videos',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed: No result returned'));
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteResource(publicId: string, resourceType: 'image' | 'video' = 'video'): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        } catch (error) {
            console.error(`Failed to delete resource ${publicId}:`, error);
            throw error;
        }
    }

    // Keeping the generic uploadFile for backward compatibility or future image uploads if needed
    async uploadFile(file: any): Promise<{ url: string; publicId: string }> {
        // Re-using the logic but defaulting to auto or image if needed. 
        // For now, let's assume this was for images.
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'agent-sport/uploads',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed: No result returned'));
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteFile(publicId: string): Promise<void> {
        return this.deleteResource(publicId, 'image');
    }
}
