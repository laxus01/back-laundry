import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

// Import entities for reports
import { Sale } from '../sales/entities/sales.entity';
import { Attention } from '../attentions/entities/attentions.entity';
import { SaleService } from '../sales/entities/sales-services.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      Attention,
      SaleService,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
