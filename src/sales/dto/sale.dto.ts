import { Product } from "../../products/entities/products.entity";
import { Washer } from "../../washers/entities/washers.entity";

export class CreateSaleDto {
  quantity: number;
  productId: Product;
  date?: Date;
  washerId?: Washer;
}

export class UpdateSaleDto {
  quantity?: number;
  productId?: Product;
  date?: Date;
  washerId?: Washer;
}