import { Module } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { ParkingsController } from './parkings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from 'src/entities/parkings.entity';
import { Vehicle } from 'src/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parking, Vehicle]),
  ],
  providers: [ParkingsService],
  controllers: [ParkingsController]
})
export class ParkingsModule {}
