import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString({ message: 'Password is required' })
  password!: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
