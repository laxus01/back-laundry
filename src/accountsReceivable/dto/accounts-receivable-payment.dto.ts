export class CreateAccountsReceivablePaymentDto {
  date: Date;
  value: number;
  detail?: string;
  accountsReceivableId: string;
}

export class UpdateAccountsReceivablePaymentDto {
  date?: Date;
  value?: number;
  detail?: string;
  accountsReceivableId?: string;
}
