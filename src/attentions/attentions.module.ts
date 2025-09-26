// src/attentions/attentions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttentionsController } from './attentions.controller';
import { AttentionsService } from './attentions.service';
import { AttentionsRepository } from './repositories/repositories/attentions.repository';
import { ATTENTIONS_REPOSITORY_TOKEN } from './interfaces/attentions-manager.interface';
import { Attention } from './entities/attentions.entity';
import { SaleService } from '../sales/entities/sales-services.entity';
import { Sale } from '../sales/entities/sales.entity';
import { Product } from '../products/entities/products.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attention,
      SaleService,
      Sale,
      Product,
      Vehicle
    ]),
  ],
  controllers: [AttentionsController],
  providers: [
    {
      provide: ATTENTIONS_REPOSITORY_TOKEN,
      useClass: AttentionsRepository,
    },
    AttentionsService,
  ],
  exports: [AttentionsService],
})
export class AttentionsModule {}