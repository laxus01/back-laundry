import { TypeParking } from 'src/entities/type-parking.entity';
import { Vehicle } from 'src/entities/vehicle.entity';

export class CreateParkingDto {
  dateInitial: Date;
  dateFinal: Date;
  value: number;
  state?: number;
  paymentStatus?: number;
  vehicleId: Vehicle;
  typeParkingId: TypeParking;
}
