import { IsString, IsOptional, IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsString({ message: 'Tên là bắt buộc' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên danh mục' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @IsInt()
  @IsOptional()
  sortOrder: number = 0;
}
