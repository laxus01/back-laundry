import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './entities/vehicle.entity';
import { TypeVehicle } from './entities/type-vehicle.entity';
import { VehiclesRepository } from './repositories/vehicles.repository';
import { VEHICLES_REPOSITORY_TOKEN } from './interfaces/vehicles-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, TypeVehicle]),
  ],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    VehiclesRepository,
    {
      provide: VEHICLES_REPOSITORY_TOKEN,
      useClass: VehiclesRepository,
    },
  ],
  exports: [VehiclesService],
})
export class VehiclesModule {}
