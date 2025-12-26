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
import { PoliciesService } from './policies.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('policies')
export class PoliciesController {
    constructor(private readonly policiesService: PoliciesService) { }

    // Public: Get all published policies
    @Get()
    findAll() {
        return this.policiesService.findAll();
    }

    // Public: Get single policy by slug
    @Get(':slugOrId')
    findOne(@Param('slugOrId') slugOrId: string) {
        // Check if it looks like a slug (contains letters) or ID
        if (slugOrId.includes('-') || /^[a-z]/.test(slugOrId)) {
            return this.policiesService.findBySlug(slugOrId);
        }
        return this.policiesService.findOne(slugOrId);
    }

    // Admin: Create policy
    @Post()
    @UseGuards(JwtGuard, AdminGuard)
    create(
        @Body()
        body: {
            slug: string;
            title: string;
            contentHtml: string;
            summary?: string;
            type: string;
            isPublished?: boolean;
        },
    ) {
        return this.policiesService.create(body);
    }

    // Admin: Update policy
    @Patch(':id')
    @UseGuards(JwtGuard, AdminGuard)
    update(
        @Param('id') id: string,
        @Body()
        body: {
            slug?: string;
            title?: string;
            contentHtml?: string;
            summary?: string;
            type?: string;
            isPublished?: boolean;
        },
    ) {
        return this.policiesService.update(id, body);
    }

    // Admin: Delete policy
    @Delete(':id')
    @UseGuards(JwtGuard, AdminGuard)
    remove(@Param('id') id: string) {
        return this.policiesService.remove(id);
    }
}
