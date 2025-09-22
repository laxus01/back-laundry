import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/sale.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSales(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
        if (!startDate || !endDate) {
            throw new BadRequestException('startDate and endDate query parameters are required');
        }
        return this.salesService.getSales(startDate, endDate);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getSaleById(@Param('id') id: number) {
        return this.salesService.getSaleById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createSale(@Body() sale: CreateSaleDto) {
        return this.salesService.createSale(sale);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteSale(@Param('id') id: number) {
        return this.salesService.deleteSale(id);
    }
}