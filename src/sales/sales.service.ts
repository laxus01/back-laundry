import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from 'src/sales/entities/sales.entity';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/sale.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
  ) {}

  async getSales(startDate: string, endDate: string) {
    const startOfDay = dayjs(startDate).startOf('day').toDate();
    const endOfDay = dayjs(endDate).endOf('day').toDate();

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

  async getSaleById(id: number) {
    return this.saleRepository.findOne({
      where: { id: id.toString() },
      relations: ['typeSaleId'],
    });
  }

  async createSale(sale: CreateSaleDto) {
    const newSale = this.saleRepository.create(sale);

    // Find the product and update its existence
    const product = await this.saleRepository.manager.findOne('Product', {
      where: { id: sale.productId },
    }) as any;
    if (!product) {
      throw new Error('Product not found');
    }
    product.existence -= sale.quantity;
    await this.saleRepository.manager.save(product);

    return this.saleRepository.save(newSale);
  }

  async deleteSale(id: number) {
    const existingSale = await this.saleRepository.findOne({
      where: { id: id.toString() },
      relations: ['productId'],
    });
    if (!existingSale) {
      throw new Error('Sale not found');
    }

    // Update the product existence
    const product = existingSale.productId;
    product.existence += existingSale.quantity;
    await this.saleRepository.manager.save(product);

    return this.saleRepository.remove(existingSale);
  }
}
