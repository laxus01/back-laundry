export class CreateParkingPaymentDto {
  date: Date;
  value: number;
  detail?: string;
  parkingId: string;
}

export class UpdateParkingPaymentDto {
  date?: Date;
  value?: number;
  detail?: string;
  parkingId?: string;
}
