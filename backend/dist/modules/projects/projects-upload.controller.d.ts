/// <reference types="multer" />
import { ProjectsService } from './projects.service';
import { CloudinaryService } from '../files/cloudinary.service';
export declare class ProjectsUploadController {
    private readonly projectsService;
    private readonly cloudinaryService;
    constructor(projectsService: ProjectsService, cloudinaryService: CloudinaryService);
    uploadThumbnail(id: string, file: Express.Multer.File): unknown;
    uploadCover(id: string, file: Express.Multer.File): unknown;
    uploadGallery(id: string, files: Express.Multer.File[]): unknown;
    replaceGallery(id: string, files: Express.Multer.File[]): unknown;
    uploadFromUrls(id: string, body: {
        thumbnailUrl?: string;
        coverUrl?: string;
        galleryUrls?: string[];
    }): unknown;
}
