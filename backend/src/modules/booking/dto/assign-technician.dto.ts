import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTechnicianDto {
  @ApiProperty({
    description: 'ID of the technician to assign',
    example: 'tech-123-uuid',
  })
  @IsNotEmpty({ message: 'Technician ID is required' })
  @IsString({ message: 'Technician ID must be a string' })
  technicianId: string;
}
