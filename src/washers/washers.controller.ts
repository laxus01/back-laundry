import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WashersService } from './washers.service';
import { CreateWasherDto } from './dto/washers.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('washers')
export class WashersController {
    constructor(private washerService: WashersService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getWashers() {
        return this.washerService.getWashers();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getWasherById(@Param('id') id: number) {
        return this.washerService.getWasherById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createWasher(@Body() washer: CreateWasherDto) {
        return this.washerService.createWasher(washer);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateWasher(@Param('id') id: number, @Body() washer: CreateWasherDto) {
        return this.washerService.updateWasher(id, washer);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteWasher(@Param('id') id: number) {
        return this.washerService.deleteWasher(id);
    }
}
