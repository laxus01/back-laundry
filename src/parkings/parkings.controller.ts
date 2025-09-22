import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { CreateParkingDto } from './dto/parking.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('parkings')
export class ParkingsController {
    constructor(private readonly parkingsService: ParkingsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getParkings(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return this.parkingsService.getParkings(startDate, endDate);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getParkingById(@Param('id') id: string) {
        return this.parkingsService.getParkingById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('date-range/search')
    async getParkingsByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        if (!startDate || !endDate) {
            throw new Error('startDate and endDate are required parameters');
        }
        return this.parkingsService.getParkingsByDateRange(startDate, endDate);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createParking(@Body() parking: CreateParkingDto) {
        return this.parkingsService.createParking(parking);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateParking(@Param('id') id: string, @Body() parking: CreateParkingDto) {
        return this.parkingsService.updateParking(id, parking);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteParking(@Param('id') id: string) {
        return this.parkingsService.deleteParking(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('insert-all-parkings')
    async insertAllParkings() {
        return this.parkingsService.insertAllParkings();
    }
}