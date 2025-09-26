import { Vehicle } from "../../vehicles/entities/vehicle.entity";

export class CreateAccountsReceivableDto {
  value: number;
  date: Date;
  detail: string;
  vehicleId: string | Vehicle;
}

export class UpdateAccountsReceivableDto {
    value?: number;
    date?: Date;
    detail?: string;
    vehicleId?: string | Vehicle;
}
