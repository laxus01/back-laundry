import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attention } from 'src/entities/attentions.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateAttentionDto, SaleProductDto, SaleServiceDto } from './dto/attention.create-attention.dto';
import { SaleService } from 'src/entities/sales-services.entity';
import { Sale } from 'src/entities/sales.entity';
import { Product } from 'src/entities/products.entity';

@Injectable()
export class AttentionsService {
  constructor(
    @InjectRepository(Attention) private attentionRepository: Repository<Attention>,
    @InjectRepository(SaleService) private saleService: Repository<SaleService>,
    @InjectRepository(Sale) private saleProduct: Repository<Sale>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getAttentions() {
    return this.attentionRepository.find({ relations: ['vehicleId', 'washerId'] });
  }

  async getAttentionById(id: string) {
    return this.attentionRepository.findOne({
      where: { id },
      relations: ['vehicleId', 'washerId'],
    });
  }

  async createAttention(attention: CreateAttentionDto) {
    const newAttention = this.attentionRepository.create(attention);
    return this.attentionRepository.save(newAttention);
  }

  async createSalesServices(salesServices: SaleServiceDto[]) {  
    const attention = await this.attentionRepository.findOne({
      where: { id: String(salesServices[0].attentionId) },
    });
    if (!attention) {
      throw new Error('Attention not found');
    }    
    const newSalesServices = salesServices.map((saleService: SaleServiceDto) => {      
      const newSaleService = this.saleService.create(saleService);
      return this.saleService.save(newSaleService);
    });
    return newSalesServices;
  }

  async createSalesProducts(sales: SaleProductDto[]) {
    const attention = await this.attentionRepository.findOne({
      where: { id: String(sales[0].attentionId) },
    });
    if (!attention) {
      throw new Error('Attention not found');
    }
    const newSales = sales.map(async (sale: SaleProductDto) => {
      const newSale = this.saleProduct.create(sale);
      await this.decreaseProductExistence(sale.productId, sale.quantity);
      return this.saleProduct.save(newSale);
    });
    return newSales;
  }  

  async decreaseProductExistence(id: DeepPartial<Product>, quantity: number) {
    const product = await this.productRepository.findOne({
      where: { id: String(id) },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.existence < quantity) {
      throw new Error('Insufficient product existence');
    }
    product.existence -= quantity;
    return this.productRepository.save(product);
  }  

  async updateAttention(id: string, attention: CreateAttentionDto) {
    const existingAttention = await this.attentionRepository.findOne({
      where: { id },
    });
    if (!existingAttention) {
      throw new Error('Attention not found');
    }
    const updatedAttention = { ...existingAttention, ...attention };
    return this.attentionRepository.save(updatedAttention);
  }

  async deleteAttention(id: string) {
    const existingAttention = await this.attentionRepository.findOne({
      where: { id },
    });
    if (!existingAttention) {
      throw new Error('Attention not found');
    }
    return this.attentionRepository.remove(existingAttention);
  }
}
