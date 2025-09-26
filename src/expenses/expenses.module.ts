import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './entities/expenses.entity';
import { ExpensesRepository } from './repositories/expenses.repository';
import { EXPENSES_REPOSITORY_TOKEN } from './interfaces/expenses-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
  ],
  controllers: [ExpensesController],
  providers: [
    ExpensesService,
    ExpensesRepository,
    {
      provide: EXPENSES_REPOSITORY_TOKEN,
      useClass: ExpensesRepository,
    },
  ],
  exports: [ExpensesService],
})
export class ExpensesModule {}
