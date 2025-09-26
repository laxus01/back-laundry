import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/products.entity';
import { IInventoryManager } from '../interfaces/inventory-manager.interface';

@Injectable()
export class InventoryManagerService implements IInventoryManager {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    await this.validateStock(productId, quantity);
    
    const product = await this.findProductById(productId);
    product.existence -= quantity;
    
    await this.productRepository.save(product);
  }

  async increaseStock(productId: string, quantity: number): Promise<void> {
    const product = await this.findProductById(productId);
    product.existence += quantity;
    
    await this.productRepository.save(product);
  }

  async validateStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.findProductById(productId);
    
    if (product.existence < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.existence}, Required: ${quantity}`
      );
    }
    
    return true;
  }

  private async findProductById(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId }
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    
    return product;
  }
}
