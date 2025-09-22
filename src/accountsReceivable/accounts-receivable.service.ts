import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsReceivable } from './entities/accounts-receivable.entity';
import { AccountsReceivablePayment } from './entities/accounts-receivable-payments.entity';
import { CreateAccountsReceivableDto, UpdateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class AccountsReceivableService {
  constructor(
    @InjectRepository(AccountsReceivable)
    private accountsReceivableRepository: Repository<AccountsReceivable>,
    @InjectRepository(AccountsReceivablePayment)
    private accountsReceivablePaymentRepository: Repository<AccountsReceivablePayment>,
  ) {}

  async getAccountsReceivable(startDate?: string, endDate?: string) {
    let accountsReceivable;

    // If date range is provided, use QueryBuilder for date filtering
    if (startDate && endDate) {
      const startOfDay = dayjs(startDate).startOf('day').toDate();
      const endOfDay = dayjs(endDate).endOf('day').toDate();

      accountsReceivable = await this.accountsReceivableRepository
        .createQueryBuilder('accountsReceivable')
        .leftJoinAndSelect('accountsReceivable.vehicleId', 'vehicle')
        .where('accountsReceivable.date >= :startDate', { startDate: startOfDay })
        .andWhere('accountsReceivable.date <= :endDate', { endDate: endOfDay })
        .orderBy('accountsReceivable.createAt', 'DESC')
        .getMany();
    } else {
      // Default behavior when no date range is provided
      accountsReceivable = await this.accountsReceivableRepository.find({
        relations: ['vehicleId'],
        order: { createAt: 'DESC' }
      });
    }

    // Calculate balance for each accounts receivable
    const accountsReceivableWithBalance = await Promise.all(
      accountsReceivable.map(async (ar) => {
        const payments = await this.accountsReceivablePaymentRepository.find({
          where: { accountsReceivableId: ar.id },
        });
        
        const totalPaid = payments.reduce((sum, payment) => sum + payment.value, 0);
        const balance = ar.value - totalPaid;

        return {
          ...ar,
          balance
        };
      })
    );

    return accountsReceivableWithBalance;
  }

  async getAccountsReceivableById(id: string) {
    return this.accountsReceivableRepository.findOne({
      where: { id },
      relations: ['vehicleId'],
    });
  }

  async createAccountsReceivable(accountsReceivable: CreateAccountsReceivableDto) {
    const newAccountsReceivable = this.accountsReceivableRepository.create({
      ...accountsReceivable,
      vehicleId: { id: accountsReceivable.vehicleId } as any,
    });
    return this.accountsReceivableRepository.save(newAccountsReceivable);
  }

  async updateAccountsReceivable(id: string, accountsReceivable: UpdateAccountsReceivableDto) {
    const existingAccountsReceivable = await this.accountsReceivableRepository.findOne({
        where: { id },
      });
      if (!existingAccountsReceivable) {
        throw new Error('Accounts receivable not found');
      }
      const updatedAccountsReceivable = { ...existingAccountsReceivable, ...accountsReceivable };
      return this.accountsReceivableRepository.save(updatedAccountsReceivable);
  }

  async deleteAccountsReceivable(id: string) {
    const existingAccountsReceivable = await this.accountsReceivableRepository.findOne({
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
    return this.accountsReceivableRepository.remove(existingAccountsReceivable);
  }

  async getAccountsReceivableByVehicle(vehicleId: string) {
    return this.accountsReceivableRepository.find({
      where: { vehicleId: { id: vehicleId } },
      relations: ['vehicleId'],
    });
  }

  async getAccountsReceivableByState(state: number) {
    return this.accountsReceivableRepository.find({
      where: { state },
      relations: ['vehicleId'],
    });
  }
}
