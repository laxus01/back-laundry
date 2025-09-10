import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/products.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getProducts() {
    return this.productRepository.find({
      where: { state: 1 },
    });
  }

  async getProductById(id: string) {
    return this.productRepository.findOne({
      where: { id: String(id) },
    });
  }

  async createProduct(product: CreateProductDto) {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async updateProduct(id: string, product: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: { id: String(id) },
    });
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    const updatedProduct = { ...existingProduct, ...product };
    return this.productRepository.save(updatedProduct);
  }

  async deleteProduct(id: string) {
    const existingProduct = await this.productRepository.findOne({
      where: { id: String(id) },
    });
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    existingProduct.state = 0;
    return this.productRepository.save(existingProduct);
  }
}