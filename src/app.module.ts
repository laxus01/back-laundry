import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AccountsReceivableModule } from './accountsReceivable/accounts-receivable.module';
import { ProvidersModule } from './provider/providers.module';
import { AccountsPayableModule } from './accountsPayable/accounts-payable.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'laundry',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 10,
      retryDelay: 3000,
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
      },
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false,
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
    UsersModule,
    ReportsModule,
    AccountsReceivableModule,
    ProvidersModule,
    AccountsPayableModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
