import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsReceivableService } from './accounts-receivable.service';
import { AccountsReceivableController } from './accounts-receivable.controller';
import { AccountsReceivable } from './entities/accounts-receivable.entity';
import { Client } from 'src/clients/entities/clients.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsReceivable, Client]),
  ],
  providers: [AccountsReceivableService],
  controllers: [AccountsReceivableController],
  exports: [AccountsReceivableService],
})
export class AccountsReceivableModule {}
