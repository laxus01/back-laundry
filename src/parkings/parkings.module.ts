import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingsController } from './parkings.controller';
import { ParkingsService } from './parkings.service';
import { ParkingPaymentsService } from './parking-payments.service';
import { ParkingPaymentsController } from './parking-payments.controller';
import { Parking } from './entities/parkings.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { TypeParking } from './entities/type-parking.entity';
import { ParkingPayment } from './entities/parking-payments.entity';
import { ParkingsRepository } from './repositories/parkings.repository';
import { PARKINGS_REPOSITORY_TOKEN } from './interfaces/parkings-manager.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parking, Vehicle, TypeParking, ParkingPayment]),
  ],
  controllers: [ParkingsController, ParkingPaymentsController],
  providers: [
    ParkingsService,
    ParkingPaymentsService,
    ParkingsRepository,
    {
      provide: PARKINGS_REPOSITORY_TOKEN,
      useClass: ParkingsRepository,
    },
  ],
  exports: [ParkingsService, ParkingPaymentsService],
})
export class ParkingsModule {}
