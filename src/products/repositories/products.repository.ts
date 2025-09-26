import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/create-product.dto';
import { IProductsRepository } from '../interfaces/products-manager.interface';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { state: 1 },
      order: { createAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.productRepository.findOne({
      where: { id: String(id) },
    });

    return product || null;
  }

  async create(productData: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create({
      ...productData,
      state: productData.state ?? 1, // Default state to 1 if not provided
    });

    return this.productRepository.save(newProduct);
  }

  async update(id: string, productData: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.findById(id);
    
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Merge the existing product with the update data
    const updatedProduct = this.productRepository.merge(existingProduct, productData);
    
    return this.productRepository.save(updatedProduct);
  }

  async delete(id: string): Promise<void> {
    const existingProduct = await this.findById(id);
    
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(existingProduct);
  }

  async softDelete(id: string): Promise<Product> {
    const existingProduct = await this.findById(id);
    
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Soft delete by setting state to 0
    existingProduct.state = 0;
    return this.productRepository.save(existingProduct);
  }
}
