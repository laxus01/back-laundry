import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expenses.entity';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto/create-expense.dto';
import { IExpensesRepository, IDateRangeQuery } from '../interfaces/expenses-manager.interface';
import * as dayjs from 'dayjs';

@Injectable()
export class ExpensesRepository implements IExpensesRepository {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async findByDateRange(dateRange: IDateRangeQuery): Promise<Expense[]> {
    const startOfDay = dayjs(dateRange.startDate).startOf('day').toDate();
    const endOfDay = dayjs(dateRange.endDate).endOf('day').toDate();

    return this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.date >= :startDate', { startDate: startOfDay })
      .andWhere('expense.date <= :endDate', { endDate: endOfDay })
      .orderBy('expense.createAt', 'DESC')
      .getMany();
  }

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({
      order: { createAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<Expense | null> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
    });

    return expense || null;
  }

  async create(expenseData: CreateExpenseDto): Promise<Expense> {
    const newExpense = this.expenseRepository.create({
      ...expenseData,
      date: expenseData.date || new Date(),
    });

    return this.expenseRepository.save(newExpense);
  }

  async update(id: string, expenseData: UpdateExpenseDto): Promise<Expense> {
    const existingExpense = await this.findById(id);
    
    if (!existingExpense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Merge the existing expense with the update data
    const updatedExpense = this.expenseRepository.merge(existingExpense, expenseData);
    
    return this.expenseRepository.save(updatedExpense);
  }

  async delete(id: string): Promise<void> {
    const existingExpense = await this.findById(id);
    
    if (!existingExpense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    await this.expenseRepository.remove(existingExpense);
  }
}
