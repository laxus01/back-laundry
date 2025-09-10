import { TypeParking } from 'src/parkings/entities/type-parking.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

export class CreateParkingDto {
  dateInitial: Date;
  dateFinal: Date;
  value: number;
  state?: number;
  paymentStatus?: number;
  vehicleId: Vehicle;
  typeParkingId: TypeParking;
}
