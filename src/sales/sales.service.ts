import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from 'src/entities/sales.entity';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
  ) {}

  async getSales() {
    return this.saleRepository.find({ relations: ['productId'] });
  }

  async getSaleById(id: number) {
    return this.saleRepository.findOne({
      where: { id },
      relations: ['typeSaleId'],
    });
  }

  async createSale(sale: CreateSaleDto) {
    const newSale = this.saleRepository.create(sale);
    return this.saleRepository.save(newSale);
  }

  async updateSale(id: number, sale: CreateSaleDto) {
    const existingSale = await this.saleRepository.findOne({
      where: { id },
    });
    if (!existingSale) {
      throw new Error('Sale not found');
    }
    const updatedSale = { ...existingSale, ...sale };
    return this.saleRepository.save(updatedSale);
  }

  async deleteSale(id: number) {
    const existingSale = await this.saleRepository.findOne({
      where: { id },
    });
    if (!existingSale) {
      throw new Error('Sale not found');
    }
    return this.saleRepository.remove(existingSale);
  }
}
