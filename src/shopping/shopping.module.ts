import { Module } from '@nestjs/common';
import { ShoppingController } from './shopping.controller';
import { ShoppingService } from './shopping.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/products.entity';
import { Shopping } from 'src/entities/shopping.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Shopping, Product]),
    ],
  controllers: [ShoppingController],
  providers: [ShoppingService]
})
export class ShoppingModule {}
