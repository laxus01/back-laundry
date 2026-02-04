export class CreateDefaulterWasherDto {
  amount: number;
  washerId: string;
  description?: string;
  date?: Date;
  isPaid?: boolean;
}

export class UpdateDefaulterWasherDto {
  amount?: number;
  washerId?: string;
  description?: string;
  date?: Date;
  isPaid?: boolean;
}
