import { Vehicle } from 'src/entities/vehicle.entity';
import { Washer } from 'src/entities/washers.entity';

export class CreateAttentionDto {
  id: string;
  percentage: number;
  washer: Washer;
  vehicle: Vehicle;
}

export class SaleDto {
  id?: string;
  createAt?: Date;
  value: number;
  quantity: number;
  attentionId: string;
  productId: string;
}

export class SaleServiceDto {
  id?: string;
  createAt?: Date;
  value: number;
  attentionId: string;
  serviceId: string;
}