import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('faq')
export class FaqController {
    constructor(private readonly faqService: FaqService) { }

    // Public: Get all active FAQs
    @Get()
    findAll() {
        return this.faqService.findAll();
    }

    // Public: Get single FAQ
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.faqService.findOne(id);
    }

    // Admin: Create FAQ
    @Post()
    @UseGuards(JwtGuard, AdminGuard)
    create(
        @Body()
        body: {
            question: string;
            answer: string;
            category?: string;
            displayOrder?: number;
        },
    ) {
        return this.faqService.create(body);
    }

    // Admin: Update FAQ
    @Patch(':id')
    @UseGuards(JwtGuard, AdminGuard)
    update(
        @Param('id') id: string,
        @Body()
        body: {
            question?: string;
            answer?: string;
            category?: string;
            displayOrder?: number;
            isActive?: boolean;
        },
    ) {
        return this.faqService.update(id, body);
    }

    // Admin: Delete FAQ
    @Delete(':id')
    @UseGuards(JwtGuard, AdminGuard)
    remove(@Param('id') id: string) {
        return this.faqService.remove(id);
    }
}
