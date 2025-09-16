export class CreateParkingDto {
  dateInitial: Date;
  dateFinal: Date;
  value: number;
  state: number;
  paymentStatus: number;
  vehicleId: string;
  typeParkingId: string;
}
