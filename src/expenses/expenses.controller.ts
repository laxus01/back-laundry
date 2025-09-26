import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getExpenses(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return this.expensesService.getExpenses(startDate, endDate);
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
    async updateExpense(@Param('id') id: string, @Body() expense: UpdateExpenseDto) {
        return this.expensesService.updateExpense(id, expense);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteExpense(@Param('id') id: string) {
        return this.expensesService.deleteExpense(id);
    }
}