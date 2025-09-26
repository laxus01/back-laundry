import { Expense } from "../entities/expenses.entity";
import { CreateExpenseDto, UpdateExpenseDto } from "../dto/create-expense.dto";

export interface IDateRangeQuery {
  startDate: string;
  endDate: string;
}

export interface IExpensesRepository {
  findByDateRange(dateRange: IDateRangeQuery): Promise<Expense[]>;
  findAll(): Promise<Expense[]>;
  findById(id: string): Promise<Expense | null>;
  create(expenseData: CreateExpenseDto): Promise<Expense>;
  update(id: string, expenseData: UpdateExpenseDto): Promise<Expense>;
  delete(id: string): Promise<void>;
}

// Token for dependency injection
export const EXPENSES_REPOSITORY_TOKEN = 'EXPENSES_REPOSITORY_TOKEN';
