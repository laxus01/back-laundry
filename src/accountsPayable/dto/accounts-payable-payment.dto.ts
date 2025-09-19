export class CreateAccountsPayablePaymentDto {
  date: Date;
  value: number;
  detail?: string;
  accountsPayableId: string;
}

export class UpdateAccountsPayablePaymentDto {
  date?: Date;
  value?: number;
  detail?: string;
  accountsPayableId?: string;
}
