import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getVehicles() {
    return this.vehiclesService.getVehicles();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getVehicleById(@Param('id') id: number) {
    return this.vehiclesService.getVehicleById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.createVehicle(createVehicleDto);
  }

  //@UseGuards(JwtAuthGuard)
  @Put(':id')
  updateVehicle(
    @Param('id') id: number,
    @Body() updateVehicleDto: CreateVehicleDto,
  ) {    
    return this.vehiclesService.updateVehicle(id, updateVehicleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteVehicle(@Param('id') id: number) {
    return this.vehiclesService.deleteVehicle(id);
  }
}
