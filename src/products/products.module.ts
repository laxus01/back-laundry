import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/products.entity';
import { ProductsRepository } from './repositories/products.repository';
import { PRODUCTS_REPOSITORY_TOKEN } from './interfaces/products-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    {
      provide: PRODUCTS_REPOSITORY_TOKEN,
      useClass: ProductsRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
