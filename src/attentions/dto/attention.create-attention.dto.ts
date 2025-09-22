import { Attention } from 'src/attentions/entities/attentions.entity';
import { Product } from 'src/products/entities/products.entity';
import { Service } from 'src/services/entities/services.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Washer } from 'src/washers/entities/washers.entity';
import { DeepPartial } from 'typeorm';

export class CreateAttentionDto {
  id: string;
  percentage: number;
  washerId: DeepPartial<Washer>;
  vehicleId: DeepPartial<Vehicle>;
}

export class SaleServiceDto {
  id?: string;
  createAt?: Date;
  value: number;
  attentionId: DeepPartial<Attention>;
  serviceId: DeepPartial<Service>;
}

export class SaleProductDto {
  id?: string;
  createAt?: Date;
  date?: Date;
  attentionId: DeepPartial<Attention>;
  productId: DeepPartial<Product>;
  quantity: number;
}