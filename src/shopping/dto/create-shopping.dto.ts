import { Product } from "src/products/entities/products.entity";

export class CreateShoppingDto {
    quantity: number;
    productId: Product;
    date?: Date;
  }