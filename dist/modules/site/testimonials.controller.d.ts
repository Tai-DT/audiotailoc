import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial-create.dto';
export declare class TestimonialsController {
    private readonly testimonialsService;
    constructor(testimonialsService: TestimonialsService);
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
    create(createTestimonialDto: CreateTestimonialDto): Promise<{
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
    update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<{
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
