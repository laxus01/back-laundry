import { Injectable, Logger, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './entities/expenses.entity';
import { IDateRangeQuery, IExpensesRepository, EXPENSES_REPOSITORY_TOKEN } from './interfaces/expenses-manager.interface';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(
    @Inject(EXPENSES_REPOSITORY_TOKEN)
    private readonly expensesRepository: IExpensesRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getExpenses(startDate?: string, endDate?: string): Promise<Expense[]> {
    this.logger.log(`Fetching expenses with date range: ${startDate} - ${endDate}`);
    
    // If date range is provided, use date filtering
    if (startDate && endDate) {
      const dateRange: IDateRangeQuery = { startDate, endDate };
      return this.expensesRepository.findByDateRange(dateRange);
    }

    // Default behavior when no date range is provided
    return this.expensesRepository.findAll();
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    this.logger.log(`Fetching expense with ID: ${id}`);
    
    return this.expensesRepository.findById(id);
  }

  async createExpense(expenseData: CreateExpenseDto): Promise<Expense> {
    this.logger.log(`Creating new expense: ${expenseData.expense}`);

    return this.dataSource.transaction(async (manager) => {
      // Create the expense
      const expense = await this.expensesRepository.create(expenseData);
      
      this.logger.log(`Expense created successfully with ID: ${expense.id}`);
      return expense;
    });
  }

  async updateExpense(id: string, expenseData: UpdateExpenseDto): Promise<Expense> {
    this.logger.log(`Updating expense with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Update the expense record
      const updatedExpense = await this.expensesRepository.update(id, expenseData);
      
      this.logger.log(`Expense updated successfully: ${id}`);
      return updatedExpense;
    });
  }

  async deleteExpense(id: string): Promise<void> {
    this.logger.log(`Deleting expense with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Delete the expense
      await this.expensesRepository.delete(id);
      
      this.logger.log(`Expense deleted successfully: ${id}`);
    });
  }
}