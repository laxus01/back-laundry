import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { AttentionsService } from './attentions.service';
import { CreateAttentionDto } from './dto/attention.create-attention.dto';

@Controller('attentions')
export class AttentionsController {
    constructor(private readonly attentionsService: AttentionsService) {}

    @Get()
    async getAttentions() {
        return this.attentionsService.getAttentions();
    }

    @Get(':id')
    async getAttentionById(@Param('id') id: number) {
        return this.attentionsService.getAttentionById(id);
    }

    @Post()
    async createAttention(@Body() attention: CreateAttentionDto) {
        return this.attentionsService.createAttention(attention);
    }

    @Put(':id')
    async updateAttention(@Param('id') id: number, @Body() attention: CreateAttentionDto) {
        return this.attentionsService.updateAttention(id, attention);
    }

    @Delete(':id')
    async deleteAttention(@Param('id') id: number) {
        return this.attentionsService.deleteAttention(id);
    }
}