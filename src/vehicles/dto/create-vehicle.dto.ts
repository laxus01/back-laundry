import { TypeVehicle } from "src/entities/type-vehicle.entity";

export class CreateVehicleDto {
  plate: string;
  client: string;
  phone: string;
  typeVehicleId: TypeVehicle;
}
