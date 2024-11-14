import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attention } from 'src/entities/attentions.entity';
import { Repository } from 'typeorm';
import { CreateAttentionDto, SaleDto, SaleServiceDto } from './dto/attention.create-attention.dto';
import { SaleService } from 'src/entities/sales-services.entity';

@Injectable()
export class AttentionsService {
  constructor(
    @InjectRepository(Attention) private attentionRepository: Repository<Attention>,
    @InjectRepository(SaleService) private saleService: Repository<SaleService>,
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

  async createSales(sales: SaleDto[]) {
    const newSales = this.attentionRepository.create(sales);
    return this.attentionRepository.save(newSales);
  }

  async createSalesServices(salesServices: SaleServiceDto[]) {  
    const attention = await this.attentionRepository.findOne({
      where: { id: salesServices[0].attentionId },
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
