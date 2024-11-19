import { Attention } from 'src/entities/attentions.entity';
import { Product } from 'src/entities/products.entity';
import { Service } from 'src/entities/services.entity';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Washer } from 'src/entities/washers.entity';
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
  attentionId: DeepPartial<Attention>;
  productId: DeepPartial<Product>;
  quantity: number;
}