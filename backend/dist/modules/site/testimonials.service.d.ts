import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial-create.dto';
export declare class TestimonialsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): unknown;
    findOne(id: string): unknown;
    create(data: CreateTestimonialDto): unknown;
    update(id: string, data: UpdateTestimonialDto): unknown;
    remove(id: string): unknown;
}
