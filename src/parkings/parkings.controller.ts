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
    @Get('search')
    async searchParkings(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('paymentStatus') paymentStatus?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortDirection') sortDirection?: 'ASC' | 'DESC',
        @Query('vehicleId') vehicleId?: string,
        @Query('state') state?: string,
        @Query('dateInitialFrom') dateInitialFrom?: string,
        @Query('dateInitialTo') dateInitialTo?: string,
        @Query('dateFinalFrom') dateFinalFrom?: string,
        @Query('dateFinalTo') dateFinalTo?: string,
        @Query('creationDateFrom') creationDateFrom?: string,
        @Query('creationDateTo') creationDateTo?: string,
    ) {
        const params = {
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
            paymentStatus: paymentStatus !== undefined ? Number(paymentStatus) : undefined,
            startDate,
            endDate,
            sortBy,
            sortDirection,
            vehicleId,
            state: state !== undefined ? Number(state) : undefined,
            dateInitialFrom,
            dateInitialTo,
            dateFinalFrom,
            dateFinalTo,
            creationDateFrom,
            creationDateTo,
        };

        return this.parkingsService.searchParkings(params as any);
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