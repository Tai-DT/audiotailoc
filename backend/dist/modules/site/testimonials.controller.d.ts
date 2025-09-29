import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial-create.dto';
export declare class TestimonialsController {
    private readonly testimonialsService;
    constructor(testimonialsService: TestimonialsService);
    findAll(): unknown;
    findOne(id: string): unknown;
    create(createTestimonialDto: CreateTestimonialDto): unknown;
    update(id: string, updateTestimonialDto: UpdateTestimonialDto): unknown;
    remove(id: string): unknown;
}
