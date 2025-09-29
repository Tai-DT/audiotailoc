import { IsNotEmpty, IsString, IsOptional, IsEmail, IsUUID, MaxLength } from 'class-validator';

export class CreateBlogCommentDto {
  @IsNotEmpty()
  @IsUUID()
  articleId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  authorName?: string;

  @IsOptional()
  @IsEmail()
  authorEmail?: string;
}

export class UpdateBlogCommentDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  authorName?: string;

  @IsOptional()
  @IsEmail()
  authorEmail?: string;
}