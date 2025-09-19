import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { AttentionsService } from './attentions.service';
import { CreateAttentionDto, SaleProductDto, SaleServiceDto } from './dto/attention.create-attention.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('attentions')
export class AttentionsController {
    constructor(private readonly attentionsService: AttentionsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAttentions() {
        return this.attentionsService.getAttentions();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getAttentionById(@Param('id') id: string) {
        return this.attentionsService.getAttentionById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('date-range/search')
    async getAttentionsByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        if (!startDate || !endDate) {
            throw new Error('Both startDate and endDate are required');
        }
        return this.attentionsService.getAttentionsByDateRange(startDate, endDate);
    }

    @UseGuards(JwtAuthGuard)
    @Get('vehicle/:vehicleId')
    async getAttentionsByVehicleId(@Param('vehicleId') vehicleId: string) {
        if (!vehicleId) {
            throw new Error('Vehicle ID is required');
        }
        return this.attentionsService.getAttentionsByVehicleId(vehicleId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createAttention(@Body() attention: CreateAttentionDto) {
        return this.attentionsService.createAttention(attention);
    }

    @UseGuards(JwtAuthGuard)
    @Post('sales/services')
    async createSalesServices(@Body() salesServices: SaleServiceDto[]) {
        return this.attentionsService.createSalesServices(salesServices);
    }

    @UseGuards(JwtAuthGuard)
    @Post('sales/products')
    async createSalesProducts(@Body() sales: SaleProductDto[]) {
        return this.attentionsService.createSalesProducts(sales);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateAttention(@Param('id') id: string, @Body() attention: CreateAttentionDto) {
        return this.attentionsService.updateAttention(id, attention);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteAttention(@Param('id') id: string) {
        return this.attentionsService.deleteAttention(id);
    }
}