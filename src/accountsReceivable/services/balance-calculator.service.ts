import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsReceivable } from '../entities/accounts-receivable.entity';
import { AccountsReceivablePayment } from '../entities/accounts-receivable-payments.entity';
import { IBalanceCalculatorService } from '../interfaces/accounts-receivable-manager.interface';

@Injectable()
export class BalanceCalculatorService implements IBalanceCalculatorService {
  constructor(
    @InjectRepository(AccountsReceivable)
    private readonly accountsReceivableRepository: Repository<AccountsReceivable>,
    @InjectRepository(AccountsReceivablePayment)
    private readonly paymentRepository: Repository<AccountsReceivablePayment>,
  ) {}

  async calculateBalance(accountsReceivableId: string): Promise<number> {
    // Get the accounts receivable record
    const accountsReceivable = await this.accountsReceivableRepository.findOne({
      where: { id: accountsReceivableId },
    });

    if (!accountsReceivable) {
      return 0;
    }

    // Get all payments for this accounts receivable
    const payments = await this.paymentRepository.find({
      where: { accountsReceivableId },
    });

    // Calculate total paid
    const totalPaid = payments.reduce((sum, payment) => sum + payment.value, 0);

    // Balance = accounts receivable value - total payments
    return accountsReceivable.value - totalPaid;
  }

  async calculateBalanceForMultiple(accountsReceivableIds: string[]): Promise<{ [key: string]: number }> {
    if (accountsReceivableIds.length === 0) {
      return {};
    }

    // Get all accounts receivable records
    const accountsReceivableRecords = await this.accountsReceivableRepository.find({
      where: accountsReceivableIds.map(id => ({ id })),
    });

    // Get all payments for these accounts receivable
    const payments = await this.paymentRepository.find({
      where: accountsReceivableIds.map(id => ({ accountsReceivableId: id })),
    });

    // Group payments by accounts receivable ID
    const paymentsByAccountsReceivable = payments.reduce((acc, payment) => {
      if (!acc[payment.accountsReceivableId]) {
        acc[payment.accountsReceivableId] = [];
      }
      acc[payment.accountsReceivableId].push(payment);
      return acc;
    }, {} as { [key: string]: AccountsReceivablePayment[] });

    // Calculate balance for each accounts receivable
    const balances: { [key: string]: number } = {};
    
    for (const accountsReceivable of accountsReceivableRecords) {
      const accountsReceivablePayments = paymentsByAccountsReceivable[accountsReceivable.id] || [];
      const totalPaid = accountsReceivablePayments.reduce((sum, payment) => sum + payment.value, 0);
      balances[accountsReceivable.id] = accountsReceivable.value - totalPaid;
    }

    return balances;
  }
}
