import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from './cloudinary.service';
export interface FileUploadResult {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string;
    metadata: Record<string, any>;
}
export interface FileValidationOptions {
    maxSize?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
    requireImage?: boolean;
    maxWidth?: number;
    maxHeight?: number;
}
export declare class FilesService {
    private readonly config;
    private readonly prisma;
    private readonly cloudinary;
    private readonly logger;
    private readonly uploadDir;
    private readonly cdnUrl;
    constructor(config: ConfigService, prisma: PrismaService, cloudinary: CloudinaryService);
    private ensureUploadDir;
    private readonly DANGEROUS_EXTENSIONS;
    private readonly DEFAULT_ALLOWED_EXTENSIONS;
    uploadFile(file: Express.Multer.File, options?: FileValidationOptions, metadata?: Record<string, any>): Promise<FileUploadResult>;
    uploadMultipleFiles(files: Express.Multer.File[], options?: FileValidationOptions, metadata?: Record<string, any>): Promise<FileUploadResult[]>;
    uploadProductImage(file: Express.Multer.File, productId: string): Promise<FileUploadResult>;
    uploadUserAvatar(file: Express.Multer.File, userId: string): Promise<FileUploadResult>;
    deleteFile(fileId: string): Promise<boolean>;
    getFileInfo(fileId: string): Promise<FileUploadResult | null>;
    listFiles(filters?: {
        type?: string;
        userId?: string;
        productId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        files: FileUploadResult[];
        total: number;
        page: number;
        limit: number;
    }>;
    private validateFile;
    private createThumbnail;
    private getImageDimensions;
    private getFileUrl;
}
