import { PartialType } from '@nestjs/mapped-types';

export class CreateWasherDto {
    washer: string;
    phone: string;
    state?: number;
}

export class UpdateWasherDto extends PartialType(CreateWasherDto) {
  // Inherits all properties from CreateWasherDto as optional
}