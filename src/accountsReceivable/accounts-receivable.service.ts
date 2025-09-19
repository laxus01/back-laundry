import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsReceivable } from './entities/accounts-receivable.entity';
import { AccountsReceivablePayment } from './entities/accounts-receivable-payments.entity';
import { CreateAccountsReceivableDto, UpdateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';

@Injectable()
export class AccountsReceivableService {
  constructor(
    @InjectRepository(AccountsReceivable)
    private accountsReceivableRepository: Repository<AccountsReceivable>,
    @InjectRepository(AccountsReceivablePayment)
    private accountsReceivablePaymentRepository: Repository<AccountsReceivablePayment>,
  ) {}

  async getAccountsReceivable() {
    const accountsReceivable = await this.accountsReceivableRepository.find({
      relations: ['clientId'],
    });

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
      relations: ['clientId'],
    });
  }

  async createAccountsReceivable(accountsReceivable: CreateAccountsReceivableDto) {
    const newAccountsReceivable = this.accountsReceivableRepository.create({
      ...accountsReceivable,
      clientId: { id: accountsReceivable.clientId } as any,
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
    return this.accountsReceivableRepository.remove(existingAccountsReceivable);
  }

  async getAccountsReceivableByClient(clientId: string) {
    return this.accountsReceivableRepository.find({
      where: { clientId: { id: clientId } },
      relations: ['clientId'],
    });
  }

  async getAccountsReceivableByState(state: number) {
    return this.accountsReceivableRepository.find({
      where: { state },
      relations: ['clientId'],
    });
  }
}
