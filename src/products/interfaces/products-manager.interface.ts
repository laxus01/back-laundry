import { Product } from "../entities/products.entity";
import { CreateProductDto, UpdateProductDto } from "../dto/create-product.dto";

export interface IProductsRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(productData: CreateProductDto): Promise<Product>;
  update(id: string, productData: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<Product>;
}

// Token for dependency injection
export const PRODUCTS_REPOSITORY_TOKEN = 'PRODUCTS_REPOSITORY_TOKEN';
