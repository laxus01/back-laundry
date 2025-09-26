import { AccountsReceivable } from '../entities/accounts-receivable.entity';
import { CreateAccountsReceivableDto, UpdateAccountsReceivableDto } from '../dto/create-accounts-receivable.dto';

// Interface for date range queries
export interface IDateRangeQuery {
  startDate: string;
  endDate: string;
}

// Interface for accounts receivable with calculated balance
export interface IAccountsReceivableWithBalance extends AccountsReceivable {
  balance: number;
}

// Repository interface for data access abstraction
export interface IAccountsReceivableRepository {
  findByDateRange(dateRange: IDateRangeQuery): Promise<AccountsReceivable[]>;
  findAll(): Promise<AccountsReceivable[]>;
  findById(id: string): Promise<AccountsReceivable | null>;
  findByVehicle(vehicleId: string): Promise<AccountsReceivable[]>;
  findByState(state: number): Promise<AccountsReceivable[]>;
  create(accountsReceivableData: CreateAccountsReceivableDto): Promise<AccountsReceivable>;
  update(id: string, accountsReceivableData: UpdateAccountsReceivableDto): Promise<AccountsReceivable>;
  delete(id: string): Promise<void>;
}

// Service interface for balance calculations
export interface IBalanceCalculatorService {
  calculateBalance(accountsReceivableId: string): Promise<number>;
  calculateBalanceForMultiple(accountsReceivableIds: string[]): Promise<{ [key: string]: number }>;
}

// Dependency injection tokens
export const ACCOUNTS_RECEIVABLE_REPOSITORY_TOKEN = 'ACCOUNTS_RECEIVABLE_REPOSITORY_TOKEN';
export const BALANCE_CALCULATOR_SERVICE_TOKEN = 'BALANCE_CALCULATOR_SERVICE_TOKEN';
