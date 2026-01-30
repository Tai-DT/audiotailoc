import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiProperty({
    description: 'Reason for cancellation',
    example: 'Customer requested to cancel due to schedule conflict',
  })
  @IsNotEmpty({ message: 'Cancellation reason is required' })
  @IsString({ message: 'Reason must be a string' })
  reason: string;

  @ApiProperty({
    description: 'ID of the user who cancelled the booking',
    example: 'user-123-uuid',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'CancelledBy must be a string' })
  cancelledBy?: string;
}
