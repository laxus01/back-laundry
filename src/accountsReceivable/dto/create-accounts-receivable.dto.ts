import { Vehicle } from "src/vehicles/entities/vehicle.entity";

export class CreateAccountsReceivableDto {
  value: number;
  date: Date;
  detail: string;
  vehicleId: Vehicle;
}

export class UpdateAccountsReceivableDto {
    value?: number;
    date?: Date;
    detail?: string;
    vehicleId?: Vehicle;
}
