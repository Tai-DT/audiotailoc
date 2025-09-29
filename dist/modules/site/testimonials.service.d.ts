import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial-create.dto';
export declare class TestimonialsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        content: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        isActive: boolean;
        displayOrder: number;
        position: string;
        company: string;
        avatarUrl: string;
    }[]>;
    findOne(id: string): Promise<{
        content: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        isActive: boolean;
        displayOrder: number;
        position: string;
        company: string;
        avatarUrl: string;
    }>;
    create(data: CreateTestimonialDto): Promise<{
        content: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        isActive: boolean;
        displayOrder: number;
        position: string;
        company: string;
        avatarUrl: string;
    }>;
    update(id: string, data: UpdateTestimonialDto): Promise<{
        content: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        isActive: boolean;
        displayOrder: number;
        position: string;
        company: string;
        avatarUrl: string;
    }>;
    remove(id: string): Promise<{
        content: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        isActive: boolean;
        displayOrder: number;
        position: string;
        company: string;
        avatarUrl: string;
    }>;
}
