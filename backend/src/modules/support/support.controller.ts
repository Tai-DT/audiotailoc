import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { SupportService } from './support.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { IsString, IsOptional, IsBoolean, IsArray, IsIn, MinLength } from 'class-validator';

class CreateArticleDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  content!: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

class CreateFAQDto {
  @IsString()
  @MinLength(1)
  question!: string;

  @IsString()
  @MinLength(1)
  answer!: string;

  @IsString()
  category!: string;

  @IsOptional()
  order?: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

class CreateTicketDto {
  @IsString()
  @MinLength(1)
  subject!: string;

  @IsString()
  @MinLength(1)
  description!: string;

  @IsString()
  email!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

class UpdateTicketStatusDto {
  @IsIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
  status!: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

  @IsOptional()
  @IsString()
  assignedTo?: string;
}

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // Knowledge Base endpoints
  @UseGuards(AdminGuard)
  @Post('kb/articles')
  createArticle(@Body() dto: CreateArticleDto) {
    return this.supportService.createArticle(dto);
  }

  @Get('kb/articles')
  getArticles(
    @Query('category') category?: string,
    @Query('published') published?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string
  ) {
    return this.supportService.getArticles({
      category,
      published: published === 'true',
      search,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Get('kb/articles/:id')
  getArticle(@Param('id') id: string) {
    return this.supportService.getArticle(id);
  }

  @Get('kb/search')
  searchKnowledgeBase(@Query('q') query: string) {
    return this.supportService.searchKnowledgeBase(query);
  }

  @Get('kb/categories')
  getKBCategories() {
    return this.supportService.getCategories();
  }

  // FAQ endpoints
  @UseGuards(AdminGuard)
  @Post('faq')
  createFAQ(@Body() dto: CreateFAQDto) {
    return this.supportService.createFAQ(dto);
  }

  @Get('faq')
  getFAQs(@Query('category') category?: string) {
    return this.supportService.getFAQs(category);
  }

  // Support Ticket endpoints
  @Post('tickets')
  createTicket(@Body() dto: CreateTicketDto) {
    return this.supportService.createTicket(dto);
  }

  @UseGuards(JwtGuard)
  @Get('tickets')
  getTickets(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string
  ) {
    return this.supportService.getTickets({
      userId,
      status,
      priority,
      assignedTo,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @UseGuards(AdminGuard)
  @Put('tickets/:id/status')
  updateTicketStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTicketStatusDto
  ) {
    return this.supportService.updateTicketStatus(id, dto.status, dto.assignedTo);
  }

  // Test email endpoint
  @Post('test-email')
  async testEmail(@Body() body: { email: string }) {
    return this.supportService.sendTestEmail(body.email);
  }
}
