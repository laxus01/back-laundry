import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsReceivableService } from './accounts-receivable.service';
import { AccountsReceivableController } from './accounts-receivable.controller';
import { AccountsReceivablePaymentsService } from './accounts-receivable-payments.service';
import { AccountsReceivablePaymentsController } from './accounts-receivable-payments.controller';
import { AccountsReceivable } from './entities/accounts-receivable.entity';
import { AccountsReceivablePayment } from './entities/accounts-receivable-payments.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsReceivable, AccountsReceivablePayment, Vehicle]),
  ],
  providers: [AccountsReceivableService, AccountsReceivablePaymentsService],
  controllers: [AccountsReceivableController, AccountsReceivablePaymentsController],
  exports: [AccountsReceivableService, AccountsReceivablePaymentsService],
})
export class AccountsReceivableModule {}
