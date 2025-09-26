import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingController } from './shopping.controller';
import { ShoppingService } from './shopping.service';
import { Shopping } from './entities/shopping.entity';
import { Product } from '../products/entities/products.entity';
import { ShoppingRepository } from './repositories/shopping.repository';
import { SHOPPING_REPOSITORY_TOKEN } from './interfaces/shopping-manager.interface';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shopping, Product]),
    SalesModule, // Import SalesModule to access InventoryManagerService
  ],
  controllers: [ShoppingController],
  providers: [
    ShoppingService,
    ShoppingRepository,
    {
      provide: SHOPPING_REPOSITORY_TOKEN,
      useClass: ShoppingRepository,
    },
  ],
  exports: [ShoppingService],
})
export class ShoppingModule {}
