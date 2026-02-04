import { Controller, Get, Param, Post, Body, Put, Delete, Patch, UseGuards, Query } from '@nestjs/common';
import { DefaulterWashersService } from './defaulter-washers.service';
import { CreateDefaulterWasherDto, UpdateDefaulterWasherDto } from './dto/create-defaulter-washer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('defaulter-washers')
export class DefaulterWashersController {
    constructor(private readonly defaulterWashersService: DefaulterWashersService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDefaulterWashers(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return this.defaulterWashersService.getDefaulterWashers(startDate, endDate);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getDefaulterWasherById(@Param('id') id: string) {
        return this.defaulterWashersService.getDefaulterWasherById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createDefaulterWasher(@Body() createDto: CreateDefaulterWasherDto) {
        return this.defaulterWashersService.createDefaulterWasher(createDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateDefaulterWasher(@Param('id') id: string, @Body() updateDto: UpdateDefaulterWasherDto) {
        return this.defaulterWashersService.updateDefaulterWasher(id, updateDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteDefaulterWasher(@Param('id') id: string) {
        return this.defaulterWashersService.deleteDefaulterWasher(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/mark-as-paid')
    async markAsPaid(@Param('id') id: string) {
        return this.defaulterWashersService.markAsPaid(id);
    }
}
