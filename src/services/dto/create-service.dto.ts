import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceDto {
    service: string;
    value: number;
    state?: number;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  // Inherits all properties from CreateServiceDto as optional
}