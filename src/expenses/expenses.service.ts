import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/expenses/entities/expenses.entity';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
  ) {}

  async getExpenses(startDate?: string, endDate?: string) {
    // If date range is provided, use QueryBuilder for date filtering
    if (startDate && endDate) {
      const startOfDay = dayjs(startDate).startOf('day').toDate();
      const endOfDay = dayjs(endDate).endOf('day').toDate();

      return this.expenseRepository
        .createQueryBuilder('expense')
        .where('expense.date >= :startDate', { startDate: startOfDay })
        .andWhere('expense.date <= :endDate', { endDate: endOfDay })
        .orderBy('expense.createAt', 'DESC')
        .getMany();
    }

    // Default behavior when no date range is provided
    return this.expenseRepository.find({
      order: { createAt: 'DESC' }
    });
  }

  async getExpenseById(id: string) {
    return this.expenseRepository.findOne({
      where: { id },
    });
  }

  async createExpense(expense: CreateExpenseDto) {
    const newExpense = this.expenseRepository.create(expense);
    return this.expenseRepository.save(newExpense);
  }

  async updateExpense(id: string, expense: CreateExpenseDto) {
    const existingExpense = await this.expenseRepository.findOne({
      where: { id },
    });
    if (!existingExpense) {
      throw new Error('Expense not found');
    }
    const updatedExpense = { ...existingExpense, ...expense };
    return this.expenseRepository.save(updatedExpense);
  }

  async deleteExpense(id: string) {
    const existingExpense = await this.expenseRepository.findOne({
      where: { id },
    });
    if (!existingExpense) {
      throw new Error('Expense not found');
    }
    return this.expenseRepository.remove(existingExpense);
  }
}