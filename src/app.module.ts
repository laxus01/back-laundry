import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { WashersModule } from './washers/washers.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { SalesModule } from './sales/sales.module';
import { ClientsModule } from './clients/clients.module';
import { AttentionsModule } from './attentions/attentions.module';
import { ParkingsModule } from './parkings/parkings.module';
import { ShoppingModule } from './shopping/shopping.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'autorack.proxy.rlwy.net',
      username: 'root',
      password: 'sOhVFUUCNWKMTniyKSobAbQOrzUpBVks',
      database: 'railway',
      port: 40168,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    VehiclesModule,
    WashersModule,
    ProductsModule,
    ServicesModule,
    SalesModule,
    ClientsModule,
    AttentionsModule,
    ParkingsModule,
    ShoppingModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
