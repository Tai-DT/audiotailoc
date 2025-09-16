import { PartialType } from '@nestjs/swagger';
import { CreateBannerDto } from './banner-create.dto';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
