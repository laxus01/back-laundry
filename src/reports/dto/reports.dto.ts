import { IWasherActivityReport, IFinancialReport } from '../interfaces/reports-manager.interface';

export class WasherActivityReportDto implements IWasherActivityReport {
  startDate: string;
  endDate: string;
  washerId: string;
  attentions: any[];
  sales: any[];
  saleServices: any[];
  advances: any[];
  summary: {
    totalAttentions: number;
    totalSales: number;
    totalSaleServices: number;
    totalAdvances: number;
    totalAdvancesValue: number;
    totalProfit: number;
    netProfit: number;
  };
}

export class FinancialReportDto implements IFinancialReport {
  period: {
    startDate: string;
    endDate: string;
  };
  income: {
    totalSales: number;
    totalServiceSales: number;
    totalParkingPayments: number;
    totalAccountsReceivablePayments: number;
    totalIncome: number;
  };
  costs: {
    totalShoppingCosts: number;
    totalExpenses: number;
    totalCosts: number;
  };
  summary: {
    netProfit: number;
    profitMargin: string;
    totalPendingPayments: number;
    totalPendingServices: number;
    totalDefaulterWashers: number;
  };
  details: {
    salesCount: number;
    serviceSalesCount: number;
    parkingPaymentsCount: number;
    accountsReceivablePaymentsCount: number;
    shoppingCount: number;
    expensesCount: number;
    pendingPaymentsCount: number;
  };
}

export class GetWasherActivityReportDto {
  startDate: string;
  endDate: string;
  washerId: string;
}

export class GetFinancialReportDto {
  startDate: string;
  endDate: string;
}
