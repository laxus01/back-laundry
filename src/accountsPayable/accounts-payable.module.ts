import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsPayableService } from 'src/accountsPayable/accounts-payable.service';
import { AccountsPayableController } from 'src/accountsPayable/accounts-payable.controller';
import { AccountsPayablePaymentsService } from 'src/accountsPayable/accounts-payable-payments.service';
import { AccountsPayablePaymentsController } from 'src/accountsPayable/accounts-payable-payments.controller';
import { AccountsPayable } from 'src/accountsPayable/entities/accounts-payable.entity';
import { AccountsPayablePayment } from 'src/accountsPayable/entities/accounts-payable-payments.entity';
import { Provider } from 'src/provider/entities/provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsPayable, AccountsPayablePayment, Provider]),
  ],
  providers: [AccountsPayableService, AccountsPayablePaymentsService],
  controllers: [AccountsPayableController, AccountsPayablePaymentsController],
  exports: [AccountsPayableService, AccountsPayablePaymentsService],
})
export class AccountsPayableModule {}
