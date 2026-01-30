import { IsNotEmpty, IsString, IsOptional, IsObject, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type NotificationType = 'ORDER' | 'PAYMENT' | 'PROMOTION' | 'SYSTEM' | 'WELCOME';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID to send notification to',
    example: 'user-123-uuid',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;

  @ApiProperty({
    description: 'Type of notification',
    example: 'ORDER',
    enum: ['ORDER', 'PAYMENT', 'PROMOTION', 'SYSTEM', 'WELCOME'],
  })
  @IsNotEmpty({ message: 'Type is required' })
  @IsString({ message: 'Type must be a string' })
  @IsIn(['ORDER', 'PAYMENT', 'PROMOTION', 'SYSTEM', 'WELCOME'], {
    message: 'Type must be one of: ORDER, PAYMENT, PROMOTION, SYSTEM, WELCOME',
  })
  type: NotificationType;

  @ApiProperty({
    description: 'Notification title',
    example: 'Booking Confirmed',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your booking has been confirmed by the technician',
  })
  @IsNotEmpty({ message: 'Message is required' })
  @IsString({ message: 'Message must be a string' })
  message: string;

  @ApiPropertyOptional({
    description: 'Additional data for the notification',
    example: { bookingId: 'booking-123', technicianId: 'tech-456' },
  })
  @IsOptional()
  @IsObject({ message: 'Data must be an object' })
  data?: Record<string, any>;
}
