import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsPayableService } from 'src/accountsPayable/accounts-payable.service';
import { AccountsPayableController } from 'src/accountsPayable/accounts-payable.controller';
import { AccountsPayable } from 'src/accountsPayable/entities/accounts-payable.entity';
import { Provider } from 'src/provider/entities/provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsPayable, Provider]),
  ],
  providers: [AccountsPayableService],
  controllers: [AccountsPayableController],
  exports: [AccountsPayableService],
})
export class AccountsPayableModule {}
