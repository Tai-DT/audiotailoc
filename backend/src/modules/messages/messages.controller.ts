import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateMessageDto, UpdateMessageDto } from './dto/message.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all messages' })
  async getMessages(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    return this.messagesService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      userId,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  async getMessage(@Param('id') id: string) {
    return this.messagesService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new message' })
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Put(':id')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update message' })
  async updateMessage(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Patch(':id/status/:status')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Update message status' })
  async updateMessageStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.messagesService.updateStatus(id, status);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  async markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }

  @Delete(':id')
  @UseGuards(AdminOrKeyGuard)
  @ApiOperation({ summary: 'Delete message' })
  async deleteMessage(@Param('id') id: string) {
    return this.messagesService.delete(id);
  }

  @UseGuards(JwtGuard)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get messages for a specific user' })
  async getUserMessages(
    @Param('userId') userId: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Req() req: any,
  ) {
    // SECURITY: Prevent IDOR - users can only view their own messages unless they're admin
    const user = req.user;
    const isAdmin = user?.role === 'ADMIN' || user?.email === process.env.ADMIN_EMAIL;
    
    // Allow admin to view any user's messages, or user to view their own messages
    if (!isAdmin && user?.sub !== userId) {
      throw new ForbiddenException('You can only view your own messages');
    }
    
    return this.messagesService.findByUserId(userId, Number(page), Number(pageSize));
  }
}
