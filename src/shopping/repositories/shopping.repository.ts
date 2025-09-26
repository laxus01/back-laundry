import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shopping } from '../entities/shopping.entity';
import { CreateShoppingDto, UpdateShoppingDto } from '../dto/create-shopping.dto';
import { IShoppingRepository, IDateRangeQuery } from '../interfaces/shopping-manager.interface';
import * as dayjs from 'dayjs';

@Injectable()
export class ShoppingRepository implements IShoppingRepository {
  constructor(
    @InjectRepository(Shopping)
    private readonly shoppingRepository: Repository<Shopping>,
  ) {}

  async findByDateRange(dateRange: IDateRangeQuery): Promise<Shopping[]> {
    const startOfDay = dayjs(dateRange.startDate).startOf('day').toDate();
    const endOfDay = dayjs(dateRange.endDate).endOf('day').toDate();

    return this.shoppingRepository
      .createQueryBuilder('shopping')
      .leftJoinAndSelect('shopping.product', 'product')
      .where('shopping.date >= :startDate', { startDate: startOfDay })
      .andWhere('shopping.date <= :endDate', { endDate: endOfDay })
      .orderBy('shopping.createAt', 'DESC')
      .getMany();
  }

  async findAll(): Promise<Shopping[]> {
    return this.shoppingRepository.find({ 
      relations: ['product'],
      order: { createAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<Shopping | null> {
    const shopping = await this.shoppingRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    return shopping || null;
  }

  async create(shoppingData: CreateShoppingDto): Promise<Shopping> {
    const newShopping = this.shoppingRepository.create({
      ...shoppingData,
      date: shoppingData.date || new Date(),
    });

    return this.shoppingRepository.save(newShopping);
  }

  async update(id: string, shoppingData: UpdateShoppingDto): Promise<Shopping> {
    const existingShopping = await this.findById(id);
    
    if (!existingShopping) {
      throw new NotFoundException(`Shopping with ID ${id} not found`);
    }

    // Merge the existing shopping with the update data
    const updatedShopping = this.shoppingRepository.merge(existingShopping, shoppingData);
    
    return this.shoppingRepository.save(updatedShopping);
  }

  async delete(id: string): Promise<void> {
    const existingShopping = await this.findById(id);
    
    if (!existingShopping) {
      throw new NotFoundException(`Shopping with ID ${id} not found`);
    }

    await this.shoppingRepository.remove(existingShopping);
  }

  async findByIdWithProduct(id: string): Promise<Shopping> {
    const shopping = await this.shoppingRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!shopping) {
      throw new NotFoundException(`Shopping with ID ${id} not found`);
    }

    return shopping;
  }
}
