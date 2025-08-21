import { Module } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { ParkingsController } from './parkings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from 'src/entities/parkings.entity';
import { Vehicle } from 'src/entities/vehicle.entity';
import { TypeParking } from 'src/entities/type-parking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parking, Vehicle, TypeParking]),
  ],
  providers: [ParkingsService],
  controllers: [ParkingsController]
})
export class ParkingsModule {}
