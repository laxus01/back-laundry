import { Vehicle } from 'src/entities/vehicle.entity';
import { Washer } from 'src/entities/washers.entity';

export class CreateAttentionDto {
  percentage: number;
  washerId: Washer;
  vehicleId: Vehicle;
  state?: number;
}