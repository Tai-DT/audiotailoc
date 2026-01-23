import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File, folder: string = 'audiotailoc'): Promise<string> {
        if (!file) {
            throw new BadRequestException('Không tìm thấy file');
        }

        try {
            // Create a promise-based upload from buffer
            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: folder,
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result as UploadApiResponse);
                    },
                );

                // Handle stream errors properly to avoid unhandledRejection
                uploadStream.on('error', (error) => {
                    console.error('Cloudinary Stream Error:', error);
                    reject(error);
                });

                uploadStream.end(file.buffer);
            });

            return result.secure_url;
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            throw new BadRequestException(
                error.message === 'Invalid image file'
                    ? 'Tệp ảnh không hợp lệ hoặc bị hỏng'
                    : 'Lỗi khi upload ảnh lên Cloudinary'
            );
        }
    }
}
