import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) {}

    @Get()
    async getExpenses() {
        return this.expensesService.getExpenses();
    }

    @Get(':id')
    async getExpenseById(@Param('id') id: number) {
        return this.expensesService.getExpenseById(id);
    }

    @Post()
    async createExpense(@Body() expense: CreateExpenseDto) {
        return this.expensesService.createExpense(expense);
    }

    @Put(':id')
    async updateExpense(@Param('id') id: number, @Body() expense: CreateExpenseDto) {
        return this.expensesService.updateExpense(id, expense);
    }

    @Delete(':id')
    async deleteExpense(@Param('id') id: number) {
        return this.expensesService.deleteExpense(id);
    }
}