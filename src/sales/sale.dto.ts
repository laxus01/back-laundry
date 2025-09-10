import { Product } from "src/products/entities/products.entity";
import { Washer } from "src/washers/entities/washers.entity";

export class CreateSaleDto {
    quantity: number;
    productId: Product;
    date?: Date;
    washerId?: Washer;
  }