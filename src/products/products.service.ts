import { Injectable, Logger, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { Product } from './entities/products.entity';
import { IProductsRepository, PRODUCTS_REPOSITORY_TOKEN } from './interfaces/products-manager.interface';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @Inject(PRODUCTS_REPOSITORY_TOKEN)
    private readonly productsRepository: IProductsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getProducts(): Promise<Product[]> {
    this.logger.log('Fetching all active products');
    
    return this.productsRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    this.logger.log(`Fetching product with ID: ${id}`);
    
    return this.productsRepository.findById(id);
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    this.logger.log(`Creating new product: ${productData.product}`);

    return this.dataSource.transaction(async (manager) => {
      // Create the product
      const product = await this.productsRepository.create(productData);
      
      this.logger.log(`Product created successfully with ID: ${product.id}`);
      return product;
    });
  }

  async updateProduct(id: string, productData: UpdateProductDto): Promise<Product> {
    this.logger.log(`Updating product with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Update the product record
      const updatedProduct = await this.productsRepository.update(id, productData);
      
      this.logger.log(`Product updated successfully: ${id}`);
      return updatedProduct;
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    this.logger.log(`Soft deleting product with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Soft delete the product (set state = 0)
      const deletedProduct = await this.productsRepository.softDelete(id);
      
      this.logger.log(`Product soft deleted successfully: ${id}`);
      return deletedProduct;
    });
  }
}