import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsPayableService } from './accounts-payable.service';
import { AccountsPayableController } from './accounts-payable.controller';
import { AccountsPayablePaymentsService } from './accounts-payable-payments.service';
import { AccountsPayablePaymentsController } from './accounts-payable-payments.controller';
import { AccountsPayable } from './entities/accounts-payable.entity';
import { AccountsPayablePayment } from './entities/accounts-payable-payments.entity';
import { Provider } from '../provider/entities/provider.entity';
import { AccountsPayableRepository } from './repositories/accounts-payable.repository';
import { BalanceCalculatorService } from './services/balance-calculator.service';
import { 
  ACCOUNTS_PAYABLE_REPOSITORY_TOKEN,
  BALANCE_CALCULATOR_SERVICE_TOKEN 
} from './interfaces/accounts-payable-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsPayable, AccountsPayablePayment, Provider]),
  ],
  controllers: [AccountsPayableController, AccountsPayablePaymentsController],
  providers: [
    AccountsPayableService,
    AccountsPayablePaymentsService,
    AccountsPayableRepository,
    BalanceCalculatorService,
    {
      provide: ACCOUNTS_PAYABLE_REPOSITORY_TOKEN,
      useClass: AccountsPayableRepository,
    },
    {
      provide: BALANCE_CALCULATOR_SERVICE_TOKEN,
      useClass: BalanceCalculatorService,
    },
  ],
  exports: [AccountsPayableService, AccountsPayablePaymentsService],
})
export class AccountsPayableModule {}
