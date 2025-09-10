import { Module } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { ParkingsController } from './parkings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from 'src/parkings/entities/parkings.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { TypeParking } from 'src/parkings/entities/type-parking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parking, Vehicle, TypeParking]),
  ],
  providers: [ParkingsService],
  controllers: [ParkingsController]
})
export class ParkingsModule {}
