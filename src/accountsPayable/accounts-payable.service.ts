import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsPayable } from './entities/accounts-payable.entity';
import { CreateAccountsPayableDto, UpdateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { AccountsPayablePayment } from './entities/accounts-payable-payments.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class AccountsPayableService {
  constructor(
    @InjectRepository(AccountsPayable)
    private accountsPayableRepository: Repository<AccountsPayable>,
    @InjectRepository(AccountsPayablePayment)
    private accountsPayablePaymentRepository: Repository<AccountsPayablePayment>,
  ) {}

  async getAccountsPayable(startDate?: string, endDate?: string) {
    let accountsPayable;

    // If date range is provided, use QueryBuilder for date filtering
    if (startDate && endDate) {
      const startOfDay = dayjs(startDate).startOf('day').toDate();
      const endOfDay = dayjs(endDate).endOf('day').toDate();

      accountsPayable = await this.accountsPayableRepository
        .createQueryBuilder('accountsPayable')
        .leftJoinAndSelect('accountsPayable.providerId', 'provider')
        .where('accountsPayable.date >= :startDate', { startDate: startOfDay })
        .andWhere('accountsPayable.date <= :endDate', { endDate: endOfDay })
        .orderBy('accountsPayable.createAt', 'DESC')
        .getMany();
    } else {
      // Default behavior when no date range is provided
      accountsPayable = await this.accountsPayableRepository.find({
        relations: ['providerId'],
        order: { createAt: 'DESC' }
      });
    }
  
    // Calculate balance for each accounts payable
    const accountsPayableWithBalance = await Promise.all(
      accountsPayable.map(async (ap) => {
        const payments = await this.accountsPayablePaymentRepository.find({
          where: { accountsPayableId: ap.id },
        });
        
        const totalPaid = payments.reduce((sum, payment) => sum + payment.value, 0);
        const balance = ap.value - totalPaid;
  
        return {
          ...ap,
          balance
        };
      })
    );
  
    return accountsPayableWithBalance;
  }

  async getAccountsPayableById(id: string) {
    return this.accountsPayableRepository.findOne({
      where: { id },
      relations: ['providerId'],
    });
  }

  async createAccountsPayable(accountsPayable: CreateAccountsPayableDto) {
    const newAccountsPayable = this.accountsPayableRepository.create({
      ...accountsPayable,
      providerId: { id: accountsPayable.providerId } as any,
    });
    return this.accountsPayableRepository.save(newAccountsPayable);
  }

  async updateAccountsPayable(id: string, accountsPayable: UpdateAccountsPayableDto) {
    const existingAccountsPayable = await this.accountsPayableRepository.findOne({
      where: { id },
    });
    if (!existingAccountsPayable) {
      throw new Error('Accounts payable not found');
    }
    
    // Handle providerId conversion if provided
    const updateData = { ...accountsPayable };
    if (accountsPayable.providerId) {
      updateData.providerId = { id: accountsPayable.providerId } as any;
    }
    
    const updatedAccountsPayable = { ...existingAccountsPayable, ...updateData };
    return this.accountsPayableRepository.save(updatedAccountsPayable);
  }

  async deleteAccountsPayable(id: string) {
    const existingAccountsPayable = await this.accountsPayableRepository.findOne({
      where: { id },
    });
    if (!existingAccountsPayable) {
      throw new Error('Accounts payable not found');
    }
    return this.accountsPayableRepository.remove(existingAccountsPayable);
  }

  async getAccountsPayableByProvider(providerId: string) {
    return this.accountsPayableRepository.find({
      where: { providerId: { id: providerId } },
      relations: ['providerId'],
    });
  }

  async getAccountsPayableByState(state: number) {
    return this.accountsPayableRepository.find({
      where: { state },
      relations: ['providerId'],
    });
  }
}
