import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { WashersService } from './washers.service';
import { CreateWasherDto } from './dto/washers.dto';

@Controller('washers')
export class WashersController {
    constructor(private washerService: WashersService) {}

    @Get()
    async getWashers() {
        return this.washerService.getWashers();
    }

    @Get(':id')
    async getWasherById(@Param('id') id: number) {
        return this.washerService.getWasherById(id);
    }

    @Post()
    async createWasher(@Body() washer: CreateWasherDto) {
        return this.washerService.createWasher(washer);
    }

    @Put(':id')
    async updateWasher(@Param('id') id: number, @Body() washer: CreateWasherDto) {
        return this.washerService.updateWasher(id, washer);
    }

    @Delete(':id')
    async deleteWasher(@Param('id') id: number) {
        return this.washerService.deleteWasher(id);
    }
}
