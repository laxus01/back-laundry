export interface IWasherActivityReport {
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

export interface IFinancialReport {
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
  };
  details: {
    salesCount: number;
    serviceSalesCount: number;
    parkingPaymentsCount: number;
    accountsReceivablePaymentsCount: number;
    shoppingCount: number;
    expensesCount: number;
  };
}

export interface IReportsRepository {
  getWasherActivityData(startDate: Date, endDate: Date, washerId: string): Promise<{
    attentions: any[];
    sales: any[];
    saleServices: any[];
    advances: any[];
  }>;

  getFinancialReportData(startDate: Date, endDate: Date): Promise<{
    salesData: any[];
    servicesSalesData: any[];
    parkingPaymentsData: any[];
    accountsReceivablePaymentsData: any[];
    shoppingData: any[];
    expensesData: any[];
  }>;
}

export const REPORTS_REPOSITORY_TOKEN = 'REPORTS_REPOSITORY';
