import { IsString, IsInt, Min, Max } from 'class-validator';

export class AddToCartDto {
  @IsString({ message: 'Product ID is required' })
  productId!: string;

  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(999, { message: 'Quantity cannot exceed 999' })
  quantity!: number;
}
