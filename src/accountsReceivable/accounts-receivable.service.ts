import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsReceivable } from './entities/accounts-receivable.entity';
import { AccountsReceivablePayment } from './entities/accounts-receivable-payments.entity';
import { CreateAccountsReceivableDto, UpdateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { 
  IAccountsReceivableRepository, 
  IBalanceCalculatorService, 
  IAccountsReceivableWithBalance,
  ACCOUNTS_RECEIVABLE_REPOSITORY_TOKEN,
  BALANCE_CALCULATOR_SERVICE_TOKEN
} from './interfaces/accounts-receivable-manager.interface';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';

@Injectable()
export class AccountsReceivableService {
  private readonly logger = new Logger(AccountsReceivableService.name);

  constructor(
    @Inject(ACCOUNTS_RECEIVABLE_REPOSITORY_TOKEN)
    private readonly accountsReceivableRepository: IAccountsReceivableRepository,
    @Inject(BALANCE_CALCULATOR_SERVICE_TOKEN)
    private readonly balanceCalculatorService: IBalanceCalculatorService,
    @InjectRepository(AccountsReceivable)
    private accountsReceivableEntityRepository: Repository<AccountsReceivable>,
    @InjectRepository(AccountsReceivablePayment)
    private accountsReceivablePaymentRepository: Repository<AccountsReceivablePayment>,
    private readonly dataSource: DataSource,
  ) {}

  async getAccountsReceivable(startDate?: string, endDate?: string): Promise<IAccountsReceivableWithBalance[]> {
    this.logger.log('Getting accounts receivable with date range filtering');
    
    try {
      let accountsReceivable;

      // If date range is provided, use date filtering
      if (startDate && endDate) {
        this.logger.log(`Filtering by date range: ${startDate} to ${endDate}`);
        const startOfDay = dayjs(startDate).startOf('day').toDate();
        const endOfDay = dayjs(endDate).endOf('day').toDate();

        accountsReceivable = await this.accountsReceivableEntityRepository
          .createQueryBuilder('accountsReceivable')
          .leftJoinAndSelect('accountsReceivable.vehicleId', 'vehicle')
          .where('accountsReceivable.date >= :startDate', { startDate: startOfDay })
          .andWhere('accountsReceivable.date <= :endDate', { endDate: endOfDay })
          .orderBy('accountsReceivable.createAt', 'DESC')
          .getMany();
      } else {
        // Default behavior when no date range is provided
        accountsReceivable = await this.accountsReceivableEntityRepository.find({
          relations: ['vehicleId'],
          order: { createAt: 'DESC' }
        });
      }

      // Calculate balance for each accounts receivable using the balance calculator service
      const accountsReceivableIds = accountsReceivable.map(ar => ar.id);
      const balances = await this.balanceCalculatorService.calculateBalanceForMultiple(accountsReceivableIds);

      const accountsReceivableWithBalance: IAccountsReceivableWithBalance[] = accountsReceivable.map(ar => ({
        ...ar,
        balance: balances[ar.id] || 0
      }));

      this.logger.log(`Retrieved ${accountsReceivableWithBalance.length} accounts receivable records`);
      return accountsReceivableWithBalance;
    } catch (error) {
      this.logger.error('Error getting accounts receivable', error.stack);
      throw error;
    }
  }

  async getAccountsReceivableById(id: string) {
    this.logger.log(`Getting accounts receivable by ID: ${id}`);
    
    try {
      const accountsReceivable = await this.accountsReceivableEntityRepository.findOne({
        where: { id },
        relations: ['vehicleId'],
      });
      
      if (accountsReceivable) {
        // Calculate balance for this specific record
        const balance = await this.balanceCalculatorService.calculateBalance(id);
        return {
          ...accountsReceivable,
          balance
        };
      }
      
      return accountsReceivable;
    } catch (error) {
      this.logger.error(`Error getting accounts receivable by ID: ${id}`, error.stack);
      throw error;
    }
  }

  async createAccountsReceivable(accountsReceivableData: CreateAccountsReceivableDto) {
    this.logger.log('Creating new accounts receivable');
    
    try {
      const newAccountsReceivable = this.accountsReceivableEntityRepository.create({
        ...accountsReceivableData,
        vehicleId: { id: accountsReceivableData.vehicleId } as any,
      });
      const createdAccountsReceivable = await this.accountsReceivableEntityRepository.save(newAccountsReceivable);
      this.logger.log(`Created accounts receivable with ID: ${createdAccountsReceivable.id}`);
      return createdAccountsReceivable;
    } catch (error) {
      this.logger.error('Error creating accounts receivable', error.stack);
      throw error;
    }
  }

  async updateAccountsReceivable(id: string, accountsReceivableData: UpdateAccountsReceivableDto) {
    this.logger.log(`Updating accounts receivable with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Update the accounts receivable record
      const updatedAccountsReceivable = await this.accountsReceivableRepository.update(id, accountsReceivableData);
      
      this.logger.log(`Accounts receivable updated successfully: ${id}`);
      return updatedAccountsReceivable;
    });
  }

  async deleteAccountsReceivable(id: string) {
    this.logger.log(`Deleting accounts receivable with ID: ${id}`);
    
    try {
      const existingAccountsReceivable = await this.accountsReceivableEntityRepository.findOne({
        where: { id },
      });
      if (!existingAccountsReceivable) {
        throw new Error('Accounts receivable not found');
      }

      // First, delete all related payments to avoid foreign key constraint error
      await this.accountsReceivablePaymentRepository.delete({
        accountsReceivableId: id,
      });

      // Then delete the accounts receivable record
      await this.accountsReceivableEntityRepository.remove(existingAccountsReceivable);
      this.logger.log(`Deleted accounts receivable with ID: ${id}`);
      return { message: 'Accounts receivable deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting accounts receivable with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async getAccountsReceivableByVehicle(vehicleId: string) {
    this.logger.log(`Getting accounts receivable by vehicle ID: ${vehicleId}`);
    
    try {
      const accountsReceivable = await this.accountsReceivableEntityRepository.find({
        where: { vehicleId: { id: vehicleId } },
        relations: ['vehicleId'],
      });
      
      // Calculate balance for each record
      const accountsReceivableIds = accountsReceivable.map(ar => ar.id);
      const balances = await this.balanceCalculatorService.calculateBalanceForMultiple(accountsReceivableIds);

      const accountsReceivableWithBalance = accountsReceivable.map(ar => ({
        ...ar,
        balance: balances[ar.id] || 0
      }));

      this.logger.log(`Retrieved ${accountsReceivableWithBalance.length} accounts receivable records for vehicle: ${vehicleId}`);
      return accountsReceivableWithBalance;
    } catch (error) {
      this.logger.error(`Error getting accounts receivable by vehicle ID: ${vehicleId}`, error.stack);
      throw error;
    }
  }

  async getAccountsReceivableByState(state: number) {
    this.logger.log(`Getting accounts receivable by state: ${state}`);
    
    try {
      const accountsReceivable = await this.accountsReceivableEntityRepository.find({
        where: { state },
        relations: ['vehicleId'],
      });
      
      // Calculate balance for each record
      const accountsReceivableIds = accountsReceivable.map(ar => ar.id);
      const balances = await this.balanceCalculatorService.calculateBalanceForMultiple(accountsReceivableIds);

      const accountsReceivableWithBalance = accountsReceivable.map(ar => ({
        ...ar,
        balance: balances[ar.id] || 0
      }));

      this.logger.log(`Retrieved ${accountsReceivableWithBalance.length} accounts receivable records with state: ${state}`);
      return accountsReceivableWithBalance;
    } catch (error) {
      this.logger.error(`Error getting accounts receivable by state: ${state}`, error.stack);
      throw error;
    }
  }
}
