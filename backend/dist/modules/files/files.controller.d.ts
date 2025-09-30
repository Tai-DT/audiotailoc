import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File): Promise<import("./files.service").FileUploadResult>;
    uploadMultipleFiles(files: Express.Multer.File[]): Promise<import("./files.service").FileUploadResult[]>;
    uploadProductImage(productId: string, file: Express.Multer.File): Promise<import("./files.service").FileUploadResult>;
    uploadUserAvatar(file: Express.Multer.File): Promise<import("./files.service").FileUploadResult>;
    getFileInfo(fileId: string): Promise<import("./files.service").FileUploadResult>;
    listFiles(type?: string, userId?: string, productId?: string, page?: string, limit?: string): Promise<{
        files: import("./files.service").FileUploadResult[];
        total: number;
        page: number;
        limit: number;
    }>;
    deleteFile(fileId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
