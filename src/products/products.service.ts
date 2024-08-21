import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getVehicles() {
    return this.productRepository.find();
  }

  async getVehicleById(id: number) {
    return this.productRepository.findOne({
      where: { id },
    });
  }

  async createVehicle(product: CreateProductDto) {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async updateVehicle(id: number, product: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
    });
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    const updatedProduct = { ...existingProduct, ...product };
    return this.productRepository.save(updatedProduct);
  }

  async deleteVehicle(id: number) {
    const existingVehicle = await this.productRepository.findOne({
      where: { id },
    });
    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }
    return this.productRepository.remove(existingVehicle);
  }
}