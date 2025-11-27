import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guestId?: string;

  @ApiPropertyOptional({ description: 'Guest full name (required if not logged in)' })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiPropertyOptional({ description: 'Guest phone number (required if not logged in)' })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  initialMessage: string;
}

export class SendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  senderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guestToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'SYSTEM', 'AI'])
  senderType?: 'USER' | 'ADMIN' | 'SYSTEM' | 'AI';
}
