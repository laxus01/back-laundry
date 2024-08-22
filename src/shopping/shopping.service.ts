import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shopping } from 'src/entities/shopping.entity';
import { Repository } from 'typeorm';
import { CreateShoppingDto } from './dto/create-shopping.dto';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(Shopping) private shoppingRepository: Repository<Shopping>,
  ) {}

  async getShoppings() {
    return this.shoppingRepository.find({ relations: ['productId'] });
  }

  async getShoppingById(id: number) {
    return this.shoppingRepository.findOne({
      where: { id },
      relations: ['typeShoppingId'],
    });
  }

  async createShopping(shopping: CreateShoppingDto) {
    const newShopping = this.shoppingRepository.create(shopping);
    return this.shoppingRepository.save(newShopping);
  }

  async updateShopping(id: number, shopping: CreateShoppingDto) {
    const existingShopping = await this.shoppingRepository.findOne({
      where: { id },
    });
    if (!existingShopping) {
      throw new Error('Shopping not found');
    }
    const updatedShopping = { ...existingShopping, ...shopping };
    return this.shoppingRepository.save(updatedShopping);
  }

  async deleteShopping(id: number) {
    const existingShopping = await this.shoppingRepository.findOne({
      where: { id },
    });
    if (!existingShopping) {
      throw new Error('Shopping not found');
    }
    return this.shoppingRepository.remove(existingShopping);
  }
}
