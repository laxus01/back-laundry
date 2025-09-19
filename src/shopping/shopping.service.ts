import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shopping } from 'src/shopping/entities/shopping.entity';
import { Repository } from 'typeorm';
import { CreateShoppingDto } from './dto/create-shopping.dto';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(Shopping) private shoppingRepository: Repository<Shopping>,
  ) {}

  async getShoppings() {
    return this.shoppingRepository.find({ relations: ['product'] });
  }

  async getShoppingById(id: string) {
    return this.shoppingRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async createShopping(shopping: CreateShoppingDto) {
    const newShopping = this.shoppingRepository.create(shopping);

    // Find the product and update its existence
    const product = await this.shoppingRepository.manager.findOne('Product', {
      where: { id: shopping.productId },
    }) as any;
    if (!product) {
      throw new Error('Product not found');
    }
    product.existence += shopping.quantity;
    await this.shoppingRepository.manager.save(product);

    return this.shoppingRepository.save(newShopping);
  }

  async updateShopping(id: string, shopping: CreateShoppingDto) {
    const existingShopping = await this.shoppingRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!existingShopping) {
      throw new Error('Shopping not found');
    }

    // If quantity is being updated, adjust product existence
    if (shopping.quantity !== undefined && shopping.quantity !== existingShopping.quantity) {
      const product = existingShopping.product;
      const quantityDifference = shopping.quantity - existingShopping.quantity;
      product.existence += quantityDifference;
      await this.shoppingRepository.manager.save(product);
    }

    const updatedShopping = { ...existingShopping, ...shopping };
    return this.shoppingRepository.save(updatedShopping);
  }

  async deleteShopping(id: string) {
    const existingShopping = await this.shoppingRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!existingShopping) {
      throw new Error('Shopping not found');
    }

    // Update product existence by subtracting the shopping quantity
    const product = existingShopping.product;
    product.existence -= existingShopping.quantity;
    await this.shoppingRepository.manager.save(product);

    return this.shoppingRepository.remove(existingShopping);
  }
}
