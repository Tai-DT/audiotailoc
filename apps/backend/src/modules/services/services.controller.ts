import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ServicesService } from './services.service';

class CreateServiceRequestDto {
  @IsString() @Length(2, 100)
  name!: string;
  @IsString() @Length(8, 20)
  phone!: string;
  @IsOptional() @IsEmail()
  email?: string;
  @IsOptional() @IsString()
  address?: string;
  @IsEnum(['REPAIR','RENTAL','INSTALLATION','TV_INSTALLATION'] as any)
  serviceType!: 'REPAIR' | 'RENTAL' | 'INSTALLATION' | 'TV_INSTALLATION';
  @IsOptional() @IsString()
  message?: string;
}

@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Post('requests')
  create(@Body() dto: CreateServiceRequestDto) {
    return this.services.createRequest(dto);
  }

  @Get('requests')
  list() {
    return this.services.listRequests();
  }
}

