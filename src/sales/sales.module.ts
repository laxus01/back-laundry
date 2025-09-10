import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/products.entity';
import { Sale } from 'src/sales/entities/sales.entity';
import { Washer } from 'src/entities/washers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Product, Washer]),
  ],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {}
