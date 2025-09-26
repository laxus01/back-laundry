import { PartialType } from '@nestjs/mapped-types';

export class CreateParkingDto {
  dateInitial: Date;
  dateFinal: Date;
  value: number;
  state: number;
  paymentStatus: number;
  vehicleId: string;
  typeParkingId: string;
}

export class UpdateParkingDto extends PartialType(CreateParkingDto) {
  // Inherits all properties from CreateParkingDto as optional
}
