import { Injectable, Logger, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IReportsRepository, REPORTS_REPOSITORY_TOKEN } from './interfaces/reports-manager.interface';
import { WasherActivityReportDto, FinancialReportDto } from './dto/reports.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @Inject(REPORTS_REPOSITORY_TOKEN)
    private readonly reportsRepository: IReportsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getWasherActivityReport(startDate: string, endDate: string, washerId: string): Promise<WasherActivityReportDto> {
    this.logger.log(`Generating washer activity report for washer ${washerId} from ${startDate} to ${endDate}`);

    try {
      // Use dayjs for date manipulation
      const startOfDay = dayjs(startDate).startOf('day').toDate();
      const endOfDay = dayjs(endDate).endOf('day').toDate();

      // Get data from repository
      const { attentions, sales, saleServices } = await this.reportsRepository.getWasherActivityData(startOfDay, endOfDay, washerId);

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

      const report: WasherActivityReportDto = {
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

      this.logger.log(`Washer activity report generated successfully for washer ${washerId}`);
      return report;
    } catch (error) {
      this.logger.error(`Error generating washer activity report for washer ${washerId}`, error.stack);
      throw error;
    }
  }

  async getFinancialReport(startDate: string, endDate: string): Promise<FinancialReportDto> {
    this.logger.log(`Generating financial report from ${startDate} to ${endDate}`);

    try {
      // Use dayjs for date manipulation
      const startOfDay = dayjs(startDate).startOf('day').toDate();
      const endOfDay = dayjs(endDate).endOf('day').toDate();

      // Get data from repository
      const {
        salesData,
        servicesSalesData,
        parkingPaymentsData,
        accountsReceivablePaymentsData,
        shoppingData,
        expensesData,
      } = await this.reportsRepository.getFinancialReportData(startOfDay, endOfDay);

      // 1. Calculate total sales (quantity * saleValue from products)
      const totalSales = salesData.reduce((sum, sale) => {
        return sum + (sale.quantity * (sale.productId?.saleValue || 0));
      }, 0);

      // 2. Calculate total service sales from sales-services entity
      const totalServiceSales = servicesSalesData.reduce((sum, saleService) => {
        return sum + saleService.value;
      }, 0);

      // 3. Calculate total parking payments
      const totalParkingPayments = parkingPaymentsData.reduce((sum, payment) => {
        return sum + payment.value;
      }, 0);

      // 4. Calculate total accounts receivable payments
      const totalAccountsReceivablePayments = accountsReceivablePaymentsData.reduce((sum, payment) => {
        return sum + payment.value;
      }, 0);

      // 5. Calculate total shopping costs (quantity * valueBuys from products)
      const totalShoppingCosts = shoppingData.reduce((sum, shopping) => {
        return sum + (shopping.quantity * (shopping.product?.valueBuys || 0));
      }, 0);

      // 6. Calculate total expenses
      const totalExpenses = expensesData.reduce((sum, expense) => {
        return sum + expense.value;
      }, 0);

      // Calculate total income and net profit
      const totalIncome = totalSales + totalServiceSales + totalParkingPayments + totalAccountsReceivablePayments;
      const totalCosts = totalShoppingCosts + totalExpenses;
      const netProfit = totalIncome - totalCosts;

      const report: FinancialReportDto = {
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

      this.logger.log(`Financial report generated successfully for period ${startDate} to ${endDate}`);
      return report;
    } catch (error) {
      this.logger.error(`Error generating financial report for period ${startDate} to ${endDate}`, error.stack);
      throw error;
    }
  }
}
