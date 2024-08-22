import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './sale.dto';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    @Get()
    async getSales() {
        return this.salesService.getSales();
    }

    @Get(':id')
    async getSaleById(@Param('id') id: number) {
        return this.salesService.getSaleById(id);
    }

    @Post()
    async createSale(@Body() sale: CreateSaleDto) {
        return this.salesService.createSale(sale);
    }

    @Put(':id')
    async updateSale(@Param('id') id: number, @Body() sale: CreateSaleDto) {
        return this.salesService.updateSale(id, sale);
    }

    @Delete(':id')
    async deleteSale(@Param('id') id: number) {
        return this.salesService.deleteSale(id);
    }
}