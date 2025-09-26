// accounts-receivable.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsReceivable } from './entities/accounts-receivable.entity';
import { AccountsReceivablePayment } from './entities/accounts-receivable-payments.entity';
import { AccountsReceivableService } from './accounts-receivable.service';
import { AccountsReceivableController } from './accounts-receivable.controller';
import { AccountsReceivablePaymentsController } from './accounts-receivable-payments.controller';
import { AccountsReceivablePaymentsService } from './accounts-receivable-payments.service';
import { BalanceCalculatorService } from './services/balance-calculator.service';
import { AccountsReceivableRepository } from './repositories/accounts-receivable.repository';
import { 
  ACCOUNTS_RECEIVABLE_REPOSITORY_TOKEN,
  BALANCE_CALCULATOR_SERVICE_TOKEN
} from './interfaces/accounts-receivable-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsReceivable, AccountsReceivablePayment]),
  ],
  controllers: [
    AccountsReceivableController, 
    AccountsReceivablePaymentsController // Asegúrate de que esté incluido aquí
  ],
  providers: [
    {
      provide: ACCOUNTS_RECEIVABLE_REPOSITORY_TOKEN,
      useClass: AccountsReceivableRepository,
    },
    {
      provide: BALANCE_CALCULATOR_SERVICE_TOKEN,
      useClass: BalanceCalculatorService,
    },
    AccountsReceivableService,
    AccountsReceivablePaymentsService, // Asegúrate de que esté incluido aquí
  ],
  exports: [AccountsReceivableService],
})
export class AccountsReceivableModule {}