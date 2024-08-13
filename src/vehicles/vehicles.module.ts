import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from 'src/entities/vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService]
})
export class VehiclesModule {}
