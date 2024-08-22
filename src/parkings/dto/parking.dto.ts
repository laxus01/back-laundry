import { Vehicle } from 'src/entities/vehicle.entity';

export class CreateParkingDto {
  dateInitial: Date;
  dateFinal: Date;
  value: number;
  state?: number;
  vehicleId: Vehicle;
}
