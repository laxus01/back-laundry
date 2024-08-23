import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/entities/expenses.entity';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
  ) {}

  async getExpenses() {
    return this.expenseRepository.find();
  }

  async getExpenseById(id: number) {
    return this.expenseRepository.findOne({
      where: { id },
    });
  }

  async createExpense(expense: CreateExpenseDto) {
    const newExpense = this.expenseRepository.create(expense);
    return this.expenseRepository.save(newExpense);
  }

  async updateExpense(id: number, expense: CreateExpenseDto) {
    const existingExpense = await this.expenseRepository.findOne({
      where: { id },
    });
    if (!existingExpense) {
      throw new Error('Expense not found');
    }
    const updatedExpense = { ...existingExpense, ...expense };
    return this.expenseRepository.save(updatedExpense);
  }

  async deleteExpense(id: number) {
    const existingExpense = await this.expenseRepository.findOne({
      where: { id },
    });
    if (!existingExpense) {
      throw new Error('Expense not found');
    }
    return this.expenseRepository.remove(existingExpense);
  }
}