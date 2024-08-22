import { Product } from "src/entities/products.entity";

export class CreateSaleDto {
    quantity: number;
    productId: Product;
  }