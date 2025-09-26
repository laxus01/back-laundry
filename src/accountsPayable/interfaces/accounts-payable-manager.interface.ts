import { AccountsPayable } from "../entities/accounts-payable.entity";
import { CreateAccountsPayableDto, UpdateAccountsPayableDto } from "../dto/create-accounts-payable.dto";

export interface IDateRangeQuery {
  startDate: string;
  endDate: string;
}

export interface IAccountsPayableWithBalance extends AccountsPayable {
  balance: number;
}

export interface IAccountsPayableRepository {
  findByDateRange(dateRange: IDateRangeQuery): Promise<AccountsPayable[]>;
  findAll(): Promise<AccountsPayable[]>;
  findById(id: string): Promise<AccountsPayable | null>;
  findByProvider(providerId: string): Promise<AccountsPayable[]>;
  findByState(state: number): Promise<AccountsPayable[]>;
  create(accountsPayableData: CreateAccountsPayableDto): Promise<AccountsPayable>;
  update(id: string, accountsPayableData: UpdateAccountsPayableDto): Promise<AccountsPayable>;
  delete(id: string): Promise<void>;
}

export interface IBalanceCalculatorService {
  calculateBalance(accountsPayableId: string): Promise<number>;
  calculateBalanceForMultiple(accountsPayable: AccountsPayable[]): Promise<IAccountsPayableWithBalance[]>;
}

// Tokens for dependency injection
export const ACCOUNTS_PAYABLE_REPOSITORY_TOKEN = 'ACCOUNTS_PAYABLE_REPOSITORY_TOKEN';
export const BALANCE_CALCULATOR_SERVICE_TOKEN = 'BALANCE_CALCULATOR_SERVICE_TOKEN';
