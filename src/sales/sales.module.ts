import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from './entities/sales.entity';
import { Product } from '../products/entities/products.entity';
import { Washer } from '../washers/entities/washers.entity';
import { InventoryManagerService } from './services/inventory-manager.service';
import { SalesRepository } from './repositories/sales.repository';
import { INVENTORY_MANAGER_TOKEN } from './interfaces/inventory-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Product, Washer]),
  ],
  controllers: [SalesController],
  providers: [
    SalesService,
    SalesRepository,
    InventoryManagerService,
    {
      provide: INVENTORY_MANAGER_TOKEN,
      useClass: InventoryManagerService,
    },
  ],
  exports: [
    SalesService, 
    InventoryManagerService,
    INVENTORY_MANAGER_TOKEN, 
  ],
})
export class SalesModule {}