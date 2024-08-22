import { Product } from "src/entities/products.entity";

export class CreateShoppingDto {
    quantity: number;
    productId: Product;
    date?: Date;
  }