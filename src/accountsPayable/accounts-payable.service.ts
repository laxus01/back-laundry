import { Injectable, Logger, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateAccountsPayableDto, UpdateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { AccountsPayable } from './entities/accounts-payable.entity';
import { 
  IAccountsPayableRepository, 
  IBalanceCalculatorService,
  IDateRangeQuery, 
  IAccountsPayableWithBalance,
  ACCOUNTS_PAYABLE_REPOSITORY_TOKEN,
  BALANCE_CALCULATOR_SERVICE_TOKEN 
} from './interfaces/accounts-payable-manager.interface';

@Injectable()
export class AccountsPayableService {
  private readonly logger = new Logger(AccountsPayableService.name);

  constructor(
    @Inject(ACCOUNTS_PAYABLE_REPOSITORY_TOKEN)
    private readonly accountsPayableRepository: IAccountsPayableRepository,
    @Inject(BALANCE_CALCULATOR_SERVICE_TOKEN)
    private readonly balanceCalculator: IBalanceCalculatorService,
    private readonly dataSource: DataSource,
  ) {}

  async getAccountsPayable(startDate?: string, endDate?: string): Promise<IAccountsPayableWithBalance[]> {
    this.logger.log(`Fetching accounts payable with date range: ${startDate} - ${endDate}`);
    
    let accountsPayable: AccountsPayable[];

    // If date range is provided, use date filtering
    if (startDate && endDate) {
      const dateRange: IDateRangeQuery = { startDate, endDate };
      accountsPayable = await this.accountsPayableRepository.findByDateRange(dateRange);
    } else {
      // Default behavior when no date range is provided
      accountsPayable = await this.accountsPayableRepository.findAll();
    }

    // Calculate balance for each accounts payable
    return this.balanceCalculator.calculateBalanceForMultiple(accountsPayable);
  }

  async getAccountsPayableById(id: string): Promise<AccountsPayable | null> {
    this.logger.log(`Fetching accounts payable with ID: ${id}`);
    
    return this.accountsPayableRepository.findById(id);
  }

  async getAccountsPayableByProvider(providerId: string): Promise<AccountsPayable[]> {
    this.logger.log(`Fetching accounts payable for provider: ${providerId}`);
    
    return this.accountsPayableRepository.findByProvider(providerId);
  }

  async getAccountsPayableByState(state: number): Promise<AccountsPayable[]> {
    this.logger.log(`Fetching accounts payable with state: ${state}`);
    
    return this.accountsPayableRepository.findByState(state);
  }

  async createAccountsPayable(accountsPayableData: CreateAccountsPayableDto): Promise<AccountsPayable> {
    this.logger.log(`Creating new accounts payable for provider: ${accountsPayableData.providerId}`);

    return this.dataSource.transaction(async (manager) => {
      // Create the accounts payable
      const accountsPayable = await this.accountsPayableRepository.create(accountsPayableData);
      
      this.logger.log(`Accounts payable created successfully with ID: ${accountsPayable.id}`);
      return accountsPayable;
    });
  }

  async updateAccountsPayable(id: string, accountsPayableData: UpdateAccountsPayableDto): Promise<AccountsPayable> {
    this.logger.log(`Updating accounts payable with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Update the accounts payable record
      const updatedAccountsPayable = await this.accountsPayableRepository.update(id, accountsPayableData);
      
      this.logger.log(`Accounts payable updated successfully: ${id}`);
      return updatedAccountsPayable;
    });
  }

  async deleteAccountsPayable(id: string): Promise<void> {
    this.logger.log(`Deleting accounts payable with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Delete the accounts payable (including related payments)
      await this.accountsPayableRepository.delete(id);
      
      this.logger.log(`Accounts payable deleted successfully: ${id}`);
    });
  }
}
