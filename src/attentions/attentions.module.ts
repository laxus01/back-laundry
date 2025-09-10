import { Module } from '@nestjs/common';
import { AttentionsController } from './attentions.controller';
import { AttentionsService } from './attentions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Washer } from 'src/washers/entities/washers.entity';
import { Attention } from 'src/attentions/entities/attentions.entity';
import { SaleService } from 'src/sales/entities/sales-services.entity';
import { Sale } from 'src/sales/entities/sales.entity';
import { Product } from 'src/products/entities/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, Washer, Attention, SaleService, Sale, Product]),
  ],
  controllers: [AttentionsController],
  providers: [AttentionsService]
})
export class AttentionsModule {}
