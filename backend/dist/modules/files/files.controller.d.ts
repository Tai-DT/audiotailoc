/// <reference types="multer" />
import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File): unknown;
    uploadMultipleFiles(files: Express.Multer.File[]): unknown;
    uploadProductImage(productId: string, file: Express.Multer.File): unknown;
    uploadUserAvatar(file: Express.Multer.File): unknown;
    getFileInfo(fileId: string): unknown;
    listFiles(type?: string, userId?: string, productId?: string, page?: string, limit?: string): unknown;
    deleteFile(fileId: string): unknown;
}
