import { Product } from "../../products/entities/products.entity";

export class CreateShoppingDto {
  quantity: number;
  productId: string;
  date?: Date;
}

export class UpdateShoppingDto {
  quantity?: number;
  productId?: string;
  date?: Date;
}