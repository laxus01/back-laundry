import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../../sales/entities/sales.entity';
import { Attention } from '../../attentions/entities/attentions.entity';
import { SaleService } from '../../sales/entities/sales-services.entity';
import { ParkingPayment } from '../../parkings/entities/parking-payments.entity';
import { AccountsReceivablePayment } from '../../accountsReceivable/entities/accounts-receivable-payments.entity';
import { Expense } from '../../expenses/entities/expenses.entity';
import { Shopping } from '../../shopping/entities/shopping.entity';
import { Product } from '../../products/entities/products.entity';
import { Advance } from '../../advances/entities/advances.entity';
import { IReportsRepository } from '../interfaces/reports-manager.interface';

@Injectable()
export class ReportsRepository implements IReportsRepository {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
    @InjectRepository(Attention)
    private readonly attentionsRepository: Repository<Attention>,
    @InjectRepository(SaleService)
    private readonly saleServicesRepository: Repository<SaleService>,
    @InjectRepository(ParkingPayment)
    private readonly parkingPaymentsRepository: Repository<ParkingPayment>,
    @InjectRepository(AccountsReceivablePayment)
    private readonly accountsReceivablePaymentsRepository: Repository<AccountsReceivablePayment>,
    @InjectRepository(Expense)
    private readonly expensesRepository: Repository<Expense>,
    @InjectRepository(Shopping)
    private readonly shoppingRepository: Repository<Shopping>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Advance)
    private readonly advancesRepository: Repository<Advance>,
  ) {}

  async getWasherActivityData(startDate: Date, endDate: Date, washerId: string): Promise<{
    attentions: any[];
    sales: any[];
    saleServices: any[];
    advances: any[];
  }> {
    // Query attentions table with SaleService relations
    const attentions = await this.attentionsRepository
      .createQueryBuilder('attention')
      .leftJoinAndSelect('attention.vehicleId', 'vehicle')
      .leftJoinAndSelect('attention.washerId', 'washer')
      .leftJoinAndSelect('attention.saleServices', 'saleServices')
      .leftJoinAndSelect('saleServices.serviceId', 'service')
      .where('attention.washerId = :washerId', { washerId })
      .andWhere('attention.createAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    // Query sales table
    const sales = await this.salesRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.productId', 'product')
      .leftJoinAndSelect('sale.attentionId', 'attention')
      .leftJoinAndSelect('sale.washerId', 'washer')
      .where('sale.washerId = :washerId', { washerId })
      .andWhere('sale.createAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
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
          .andWhere('saleService.createAt BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          })
          .getMany()
      : [];

    // Query advances for the washer
    const advances = await this.advancesRepository
      .createQueryBuilder('advance')
      .leftJoinAndSelect('advance.washer', 'washer')
      .where('advance.washerId = :washerId', { washerId })
      .andWhere('advance.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('advance.state = :state', { state: 1 })
      .getMany();

    return {
      attentions,
      sales,
      saleServices,
      advances,
    };
  }

  async getFinancialReportData(startDate: Date, endDate: Date): Promise<{
    salesData: any[];
    servicesSalesData: any[];
    parkingPaymentsData: any[];
    accountsReceivablePaymentsData: any[];
    shoppingData: any[];
    expensesData: any[];
  }> {
    // 1. Get sales data (quantity * saleValue from products)
    const salesData = await this.salesRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.productId', 'product')
      .where('sale.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    // 2. Get service sales from sales-services entity
    const servicesSalesData = await this.saleServicesRepository
      .createQueryBuilder('saleService')
      .where('saleService.createAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    // 3. Get parking payments
    const parkingPaymentsData = await this.parkingPaymentsRepository
      .createQueryBuilder('parkingPayment')
      .where('parkingPayment.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    // 4. Get accounts receivable payments
    const accountsReceivablePaymentsData = await this.accountsReceivablePaymentsRepository
      .createQueryBuilder('accountsReceivablePayment')
      .where('accountsReceivablePayment.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    // 5. Get shopping costs (quantity * valueBuys from products)
    const shoppingData = await this.shoppingRepository
      .createQueryBuilder('shopping')
      .leftJoinAndSelect('shopping.product', 'product')
      .where('shopping.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    // 6. Get expenses
    const expensesData = await this.expensesRepository
      .createQueryBuilder('expense')
      .where('expense.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    return {
      salesData,
      servicesSalesData,
      parkingPaymentsData,
      accountsReceivablePaymentsData,
      shoppingData,
      expensesData,
    };
  }
}
