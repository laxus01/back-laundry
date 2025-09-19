import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../sales/entities/sales.entity';
import { Attention } from '../attentions/entities/attentions.entity';
import { SaleService } from '../sales/entities/sales-services.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(Attention)
    private attentionsRepository: Repository<Attention>,
    @InjectRepository(SaleService)
    private saleServicesRepository: Repository<SaleService>,
  ) {}

  async getWasherActivityReport(startDate: string, endDate: string, washerId: string) {
    // Use dayjs for date manipulation
    const startOfDay = dayjs(startDate).startOf('day').toDate();
    const endOfDay = dayjs(endDate).endOf('day').toDate();

    // Query attentions table with SaleService relations
    const attentions = await this.attentionsRepository
      .createQueryBuilder('attention')
      .leftJoinAndSelect('attention.vehicleId', 'vehicle')
      .leftJoinAndSelect('attention.washerId', 'washer')
      .leftJoinAndSelect('attention.saleServices', 'saleServices')
      .leftJoinAndSelect('saleServices.serviceId', 'service')
      .where('attention.washerId = :washerId', { washerId })
      .andWhere('attention.createAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getMany();

    // Query sales table
    const sales = await this.salesRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.productId', 'product')
      .leftJoinAndSelect('sale.attentionId', 'attention')
      .leftJoinAndSelect('sale.washerId', 'washer')
      .where('sale.washerId = :washerId', { washerId })
      .andWhere('sale.createAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getMany();

    // Query sale-services by attentionId from the found attentions
    const attentionIds = attentions.map(attention => attention.id);
    const saleServices = attentionIds.length > 0 
      ? await this.saleServicesRepository
          .createQueryBuilder('saleService')
          .leftJoinAndSelect('saleService.serviceId', 'service')
          .leftJoinAndSelect('saleService.attentionId', 'attention')
          .where('saleService.attentionId IN (:...attentionIds)', { attentionIds })
          .andWhere('saleService.createAt BETWEEN :startOfDay AND :endOfDay', {
            startOfDay,
            endOfDay,
          })
          .getMany()
      : [];

    // Add washerProfit calculation to each attention
    const attentionsWithProfit = attentions.map(attention => {
      // Calculate the sum of all service values for this attention
      const totalServiceValue = attention.saleServices?.reduce((sum, saleService) => {
        return sum + (saleService.serviceId?.value || 0);
      }, 0) || 0;

      // Calculate washer profit: (totalServiceValue * percentage) / 100
      const washerProfit = (totalServiceValue * attention.percentage) / 100;

      return {
        ...attention,
        washerProfit,
      };
    });

    return {
      startDate,
      endDate,
      washerId,
      attentions: attentionsWithProfit,
      sales,
      saleServices,
      summary: {
        totalAttentions: attentions.length,
        totalSales: sales.length,
        totalSaleServices: saleServices.length,
      },
    };
  }
}
