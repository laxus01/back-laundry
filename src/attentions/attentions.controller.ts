import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { AttentionsService } from './attentions.service';
import { CreateAttentionDto, SaleDto, SaleServiceDto } from './dto/attention.create-attention.dto';

@Controller('attentions')
export class AttentionsController {
    constructor(private readonly attentionsService: AttentionsService) {}

    @Get()
    async getAttentions() {
        return this.attentionsService.getAttentions();
    }

    @Get(':id')
    async getAttentionById(@Param('id') id: string) {
        return this.attentionsService.getAttentionById(id);
    }

    @Post()
    async createAttention(@Body() attention: CreateAttentionDto) {
        return this.attentionsService.createAttention(attention);
    }

    @Post('sales/services')
    async createSalesServices(@Body() salesServices: SaleServiceDto[]) {
        return this.attentionsService.createSalesServices(salesServices);
    }

    @Put(':id')
    async updateAttention(@Param('id') id: string, @Body() attention: CreateAttentionDto) {
        return this.attentionsService.updateAttention(id, attention);
    }

    @Delete(':id')
    async deleteAttention(@Param('id') id: string) {
        return this.attentionsService.deleteAttention(id);
    }
}