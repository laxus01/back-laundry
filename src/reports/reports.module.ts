import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportsRepository } from './repositories/reports.repository';
import { REPORTS_REPOSITORY_TOKEN } from './interfaces/reports-manager.interface';

// Import entities for reports
import { Sale } from '../sales/entities/sales.entity';
import { Attention } from '../attentions/entities/attentions.entity';
import { SaleService } from '../sales/entities/sales-services.entity';
import { ParkingPayment } from '../parkings/entities/parking-payments.entity';
import { AccountsReceivablePayment } from '../accountsReceivable/entities/accounts-receivable-payments.entity';
import { Expense } from '../expenses/entities/expenses.entity';
import { Shopping } from '../shopping/entities/shopping.entity';
import { Product } from '../products/entities/products.entity';
import { Advance } from '../advances/entities/advances.entity';

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
      Advance,
    ]),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportsRepository,
    {
      provide: REPORTS_REPOSITORY_TOKEN,
      useClass: ReportsRepository,
    },
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
