import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { CreateParkingDto } from './dto/parking.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('parkings')
export class ParkingsController {
    constructor(private readonly parkingsService: ParkingsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getParkings() {
        return this.parkingsService.getParkings();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getParkingById(@Param('id') id: string) {
        return this.parkingsService.getParkingById(id);
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