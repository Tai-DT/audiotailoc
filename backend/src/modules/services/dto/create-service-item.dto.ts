import { IsString, IsNumber, Min } from 'class-validator';

export class CreateServiceItemDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  priceCents!: number;
}
