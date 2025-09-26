export class CreateExpenseDto {
  expense: string;
  value: number;
  date?: Date;
}

export class UpdateExpenseDto {
  expense?: string;
  value?: number;
  date?: Date;
}
