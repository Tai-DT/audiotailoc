import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { IsString, IsOptional, IsBoolean, IsIn, MinLength } from 'class-validator';

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

  // FAQ endpoints
  @UseGuards(JwtGuard, AdminOrKeyGuard)
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
    @Query('pageSize') pageSize?: string,
    @Req() req?: any,
  ) {
    // SECURITY: Prevent IDOR - users can only view their own tickets unless they're admin
    const authenticatedUserId = req?.user?.sub || req?.user?.id;
    const isAdmin = req?.user?.role === 'ADMIN' || req?.user?.email === process.env.ADMIN_EMAIL;

    // If userId is provided and user is not admin, verify it matches authenticated user
    if (userId && !isAdmin && userId !== authenticatedUserId) {
      throw new ForbiddenException('You can only view your own support tickets');
    }

    // Use authenticated user's ID if userId not provided
    const targetUserId = userId || authenticatedUserId;

    return this.supportService.getTickets({
      userId: targetUserId,
      status,
      priority,
      assignedTo,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Put('tickets/:id/status')
  updateTicketStatus(@Param('id') id: string, @Body() dto: UpdateTicketStatusDto) {
    return this.supportService.updateTicketStatus(id, dto.status, dto.assignedTo);
  }

  // Test email endpoint
  @Post('test-email')
  async testEmail(@Body() body: { email: string }) {
    return this.supportService.sendTestEmail(body.email);
  }
}
