import { PartialType } from '@nestjs/swagger';
import { CreateServiceTypeDto } from './create-service-type.dto';

export class UpdateServiceTypeDto extends PartialType(CreateServiceTypeDto) {
  // You can add specific update validations here if needed
}
