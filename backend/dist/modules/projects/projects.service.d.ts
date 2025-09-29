import { PrismaService } from '../../prisma/prisma.service';
export declare class ProjectsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        page?: number;
        limit?: number;
        status?: string;
        featured?: boolean;
        category?: string;
    }): unknown;
    findFeatured(): unknown;
    findBySlug(slug: string): unknown;
    findById(id: string): unknown;
    create(data: any): unknown;
    update(id: string, data: any): unknown;
    remove(id: string): unknown;
    toggleFeatured(id: string): unknown;
    toggleActive(id: string): unknown;
    updateDisplayOrder(id: string, displayOrder: number): unknown;
    private generateSlug;
    private extractYouTubeId;
    updateImages(id: string, imageData: {
        thumbnailImage?: string;
        coverImage?: string;
        galleryImages?: string;
    }): unknown;
}
