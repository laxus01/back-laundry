import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsPayablePayment } from '../entities/accounts-payable-payments.entity';
import { AccountsPayable } from '../entities/accounts-payable.entity';
import { IBalanceCalculatorService, IAccountsPayableWithBalance } from '../interfaces/accounts-payable-manager.interface';

@Injectable()
export class BalanceCalculatorService implements IBalanceCalculatorService {
  constructor(
    @InjectRepository(AccountsPayablePayment)
    private readonly paymentRepository: Repository<AccountsPayablePayment>,
  ) {}

  async calculateBalance(accountsPayableId: string): Promise<number> {
    const payments = await this.paymentRepository.find({
      where: { accountsPayableId },
    });
    
    const totalPaid = payments.reduce((sum, payment) => sum + payment.value, 0);
    
    // We need to get the accounts payable value to calculate balance
    // This will be handled by the service that calls this method
    return totalPaid;
  }

  async calculateBalanceForMultiple(accountsPayable: AccountsPayable[]): Promise<IAccountsPayableWithBalance[]> {
    const accountsPayableWithBalance = await Promise.all(
      accountsPayable.map(async (ap) => {
        const totalPaid = await this.calculateBalance(ap.id);
        const balance = ap.value - totalPaid;

        return {
          ...ap,
          balance
        } as IAccountsPayableWithBalance;
      })
    );

    return accountsPayableWithBalance;
  }
}
