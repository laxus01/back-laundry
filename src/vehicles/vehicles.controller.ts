import { Controller, Get, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getVehicles() {
    return this.vehiclesService.getVehicles();
  }
}
