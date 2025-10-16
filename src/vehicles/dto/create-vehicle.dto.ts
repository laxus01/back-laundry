import { TypeVehicle } from "src/vehicles/entities/type-vehicle.entity";
import { PartialType } from '@nestjs/mapped-types';

export class CreateVehicleDto {
  id?: string;
  plate: string;
  client?: string;
  phone?: string;
  typeVehicleId: TypeVehicle;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  // Inherits all properties from CreateVehicleDto as optional
}
