import { Module } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { ParkingsController } from './parkings.controller';
import { ParkingPaymentsService } from './parking-payments.service';
import { ParkingPaymentsController } from './parking-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from 'src/parkings/entities/parkings.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { TypeParking } from 'src/parkings/entities/type-parking.entity';
import { ParkingPayment } from 'src/parkings/entities/parking-payments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parking, Vehicle, TypeParking, ParkingPayment]),
  ],
  providers: [ParkingsService, ParkingPaymentsService],
  controllers: [ParkingsController, ParkingPaymentsController]
})
export class ParkingsModule {}
