import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class NewsletterSubscriptionDto {
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
