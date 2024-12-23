import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './sale.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSales() {
        return this.salesService.getSales();
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