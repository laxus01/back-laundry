import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../sales/entities/sales.entity';
import { Attention } from '../attentions/entities/attentions.entity';
import { SaleService } from '../sales/entities/sales-services.entity';
import { ParkingPayment } from '../parkings/entities/parking-payments.entity';
import { AccountsReceivablePayment } from '../accountsReceivable/entities/accounts-receivable-payments.entity';
import { Expense } from '../expenses/entities/expenses.entity';
import { Shopping } from '../shopping/entities/shopping.entity';
import { Product } from '../products/entities/products.entity';
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
    @InjectRepository(ParkingPayment)
    private parkingPaymentsRepository: Repository<ParkingPayment>,
    @InjectRepository(AccountsReceivablePayment)
    private accountsReceivablePaymentsRepository: Repository<AccountsReceivablePayment>,
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    @InjectRepository(Shopping)
    private shoppingRepository: Repository<Shopping>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
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

  async getFinancialReport(startDate: string, endDate: string) {
    // Use dayjs for date manipulation
    const startOfDay = dayjs(startDate).startOf('day').toDate();
    const endOfDay = dayjs(endDate).endOf('day').toDate();

    // 1. Calculate total sales (quantity * saleValue from products)
    const salesData = await this.salesRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.productId', 'product')
      .where('sale.date BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getMany();

    const totalSales = salesData.reduce((sum, sale) => {
      return sum + (sale.quantity * (sale.productId?.saleValue || 0));
    }, 0);

    // 2. Calculate total service sales from sales-services entity
    const servicesSalesData = await this.saleServicesRepository
      .createQueryBuilder('saleService')
      .where('saleService.createAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getMany();

    const totalServiceSales = servicesSalesData.reduce((sum, saleService) => {
      return sum + saleService.value;
    }, 0);

    // 3. Calculate total parking payments
    const parkingPaymentsData = await this.parkingPaymentsRepository
      .createQueryBuilder('parkingPayment')
      .where('parkingPayment.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    const totalParkingPayments = parkingPaymentsData.reduce((sum, payment) => {
      return sum + payment.value;
    }, 0);

    // 4. Calculate total accounts receivable payments
    const accountsReceivablePaymentsData = await this.accountsReceivablePaymentsRepository
      .createQueryBuilder('accountsReceivablePayment')
      .where('accountsReceivablePayment.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    const totalAccountsReceivablePayments = accountsReceivablePaymentsData.reduce((sum, payment) => {
      return sum + payment.value;
    }, 0);

    // 5. Calculate total shopping costs (quantity * valueBuys from products)
    const shoppingData = await this.shoppingRepository
      .createQueryBuilder('shopping')
      .leftJoinAndSelect('shopping.product', 'product')
      .where('shopping.date BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getMany();

    const totalShoppingCosts = shoppingData.reduce((sum, shopping) => {
      return sum + (shopping.quantity * (shopping.product?.valueBuys || 0));
    }, 0);

    // 6. Calculate total expenses
    const expensesData = await this.expensesRepository
      .createQueryBuilder('expense')
      .where('expense.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    const totalExpenses = expensesData.reduce((sum, expense) => {
      return sum + expense.value;
    }, 0);

    // Calculate total income and net profit
    const totalIncome = totalSales + totalServiceSales + totalParkingPayments + totalAccountsReceivablePayments;
    const totalCosts = totalShoppingCosts + totalExpenses;
    const netProfit = totalIncome - totalCosts;

    return {
      period: {
        startDate,
        endDate,
      },
      income: {
        totalSales,
        totalServiceSales,
        totalParkingPayments,
        totalAccountsReceivablePayments,
        totalIncome,
      },
      costs: {
        totalShoppingCosts,
        totalExpenses,
        totalCosts,
      },
      summary: {
        netProfit,
        profitMargin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : '0.00',
      },
      details: {
        salesCount: salesData.length,
        serviceSalesCount: servicesSalesData.length,
        parkingPaymentsCount: parkingPaymentsData.length,
        accountsReceivablePaymentsCount: accountsReceivablePaymentsData.length,
        shoppingCount: shoppingData.length,
        expensesCount: expensesData.length,
      },
    };
  }
}
