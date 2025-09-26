import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ParkingPaymentsService } from './parking-payments.service';
import { CreateParkingPaymentDto, UpdateParkingPaymentDto } from './dto/parking-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('parking-payments')
export class ParkingPaymentsController {
  constructor(private readonly parkingPaymentsService: ParkingPaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getParkingPayments(@Query('parkingId') parkingId?: string) {
    if (parkingId) {
      return this.parkingPaymentsService.getParkingPaymentsByParkingId(parkingId);
    }
    return this.parkingPaymentsService.getParkingPayments();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getParkingPaymentById(@Param('id') id: string) {
    return this.parkingPaymentsService.getParkingPaymentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createParkingPayment(@Body() createParkingPaymentDto: CreateParkingPaymentDto) {
    return this.parkingPaymentsService.createParkingPayment(createParkingPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateParkingPayment(
    @Param('id') id: string,
    @Body() updateParkingPaymentDto: UpdateParkingPaymentDto,
  ) {
    return this.parkingPaymentsService.updateParkingPayment(id, updateParkingPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteParkingPayment(@Param('id') id: string) {
    await this.parkingPaymentsService.deleteParkingPayment(id);
    return { message: 'Parking payment deleted successfully' };
  }
}
