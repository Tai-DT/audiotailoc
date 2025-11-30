import { Controller, Get } from '@nestjs/common';
import { SupportService } from './support.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Knowledge Base')
@Controller('knowledge-base')
export class KnowledgeBaseController {
    constructor(private readonly supportService: SupportService) { }

    @Get()
    @ApiOperation({ summary: 'Get knowledge base categories' })
    @ApiResponse({ status: 200, description: 'Return all knowledge base categories.' })
    getKnowledgeBase() {
        return this.supportService.getCategories();
    }
}
