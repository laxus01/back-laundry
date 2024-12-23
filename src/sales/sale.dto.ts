import { Product } from "src/entities/products.entity";
import { Washer } from "src/entities/washers.entity";

export class CreateSaleDto {
    quantity: number;
    productId: Product;
    date?: Date;
    washerId?: Washer;
  }