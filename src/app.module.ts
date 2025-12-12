import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
      envFilePath: '.evn',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        retryAttempts: 10,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
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
