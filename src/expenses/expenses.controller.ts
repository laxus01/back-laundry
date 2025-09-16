import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getExpenses() {
        return this.expensesService.getExpenses();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getExpenseById(@Param('id') id: string) {
        return this.expensesService.getExpenseById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createExpense(@Body() expense: CreateExpenseDto) {
        return this.expensesService.createExpense(expense);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateExpense(@Param('id') id: string, @Body() expense: CreateExpenseDto) {
        return this.expensesService.updateExpense(id, expense);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteExpense(@Param('id') id: string) {
        return this.expensesService.deleteExpense(id);
    }
}