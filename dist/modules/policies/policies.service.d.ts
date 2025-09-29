import { PrismaService } from '../../prisma/prisma.service';
export interface Policy {
    id: string;
    slug: string;
    title: string;
    contentHtml: string;
    summary?: string | null;
    type: string;
    isPublished: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PoliciesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Policy[]>;
    findByType(type: string): Promise<Policy | null>;
    findBySlug(slug: string): Promise<Policy | null>;
    create(data: {
        title: string;
        contentHtml: string;
        summary?: string;
        type: string;
        isPublished?: boolean;
    }): Promise<Policy>;
    update(slug: string, data: {
        title?: string;
        contentHtml?: string;
        summary?: string;
        isPublished?: boolean;
    }): Promise<Policy>;
    delete(slug: string): Promise<Policy>;
    incrementViewCount(slug: string): Promise<void>;
}
