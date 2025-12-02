import { IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
    message: 'Password must contain at least one special character'
  })
  password!: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Name cannot be empty' })
  @MaxLength(100, { message: 'Name is too long' })
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]+$/, { message: 'Invalid phone number format' })
  phone?: string;
}
