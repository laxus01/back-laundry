import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { CreateParkingDto } from './dto/parking.dto';

@Controller('parkings')
export class ParkingsController {
    constructor(private readonly parkingsService: ParkingsService) {}

    @Get()
    async getParkings() {
        return this.parkingsService.getParkings();
    }

    @Get(':id')
    async getParkingById(@Param('id') id: number) {
        return this.parkingsService.getParkingById(id);
    }

    @Post()
    async createParking(@Body() parking: CreateParkingDto) {
        return this.parkingsService.createParking(parking);
    }

    @Put(':id')
    async updateParking(@Param('id') id: number, @Body() parking: CreateParkingDto) {
        return this.parkingsService.updateParking(id, parking);
    }

    @Delete(':id')
    async deleteParking(@Param('id') id: number) {
        return this.parkingsService.deleteParking(id);
    }
}