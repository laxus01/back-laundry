import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

// Import entities for reports
import { Sale } from '../sales/entities/sales.entity';
import { Attention } from '../attentions/entities/attentions.entity';
import { SaleService } from '../sales/entities/sales-services.entity';
import { ParkingPayment } from '../parkings/entities/parking-payments.entity';
import { AccountsReceivablePayment } from '../accountsReceivable/entities/accounts-receivable-payments.entity';
import { Expense } from '../expenses/entities/expenses.entity';
import { Shopping } from '../shopping/entities/shopping.entity';
import { Product } from '../products/entities/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      Attention,
      SaleService,
      ParkingPayment,
      AccountsReceivablePayment,
      Expense,
      Shopping,
      Product,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
