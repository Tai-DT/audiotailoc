import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubscribeNewsletterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  name?: string;
}