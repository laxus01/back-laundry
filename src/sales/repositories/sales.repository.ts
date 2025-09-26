import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../entities/sales.entity';
import { CreateSaleDto, UpdateSaleDto } from '../dto/sale.dto';
import { ISalesRepository, IDateRangeQuery } from '../interfaces/inventory-manager.interface';
import * as dayjs from 'dayjs';

@Injectable()
export class SalesRepository implements ISalesRepository {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}

  async findByDateRange(dateRange: IDateRangeQuery): Promise<Sale[]> {
    const startOfDay = dayjs(dateRange.startDate).startOf('day').toDate();
    const endOfDay = dayjs(dateRange.endDate).endOf('day').toDate();

    return this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.productId', 'product')
      .leftJoinAndSelect('sale.washerId', 'washer')
      .leftJoinAndSelect('sale.attentionId', 'attention')
      .where('sale.date >= :startDate', { startDate: startOfDay })
      .andWhere('sale.date <= :endDate', { endDate: endOfDay })
      .orderBy('sale.createAt', 'DESC')
      .getMany();
  }

  async findById(id: string): Promise<Sale | null> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['productId', 'washerId', 'attentionId'],
    });

    return sale || null;
  }

  async create(saleData: CreateSaleDto): Promise<Sale> {
    const newSale = this.saleRepository.create({
      ...saleData,
      date: saleData.date || new Date(),
    });

    return this.saleRepository.save(newSale);
  }

  async update(id: string, saleData: UpdateSaleDto): Promise<Sale> {
    const existingSale = await this.findById(id);
    
    if (!existingSale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    // Merge the existing sale with the update data
    const updatedSale = this.saleRepository.merge(existingSale, saleData);
    
    return this.saleRepository.save(updatedSale);
  }

  async delete(id: string): Promise<void> {
    const existingSale = await this.findById(id);
    
    if (!existingSale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    await this.saleRepository.remove(existingSale);
  }

  async findByIdWithProduct(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['productId'],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }
}
