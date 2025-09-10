import { TypeVehicle } from "src/vehicles/entities/type-vehicle.entity";

export class CreateVehicleDto {
  id?: string;
  plate: string;
  client: string;
  phone: string;
  typeVehicleId: TypeVehicle;
}
