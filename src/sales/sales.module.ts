import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/products.entity';
import { Sale } from 'src/entities/sales.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Product]),
  ],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {}
