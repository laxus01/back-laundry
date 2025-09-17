import { Client } from "src/clients/entities/clients.entity";

export class CreateAccountsReceivableDto {
  value: number;
  date: Date;
  detail: string;
  clientId: Client;
}

export class UpdateAccountsReceivableDto {
    value?: number;
    date?: Date;
    detail?: string;
    clientId?: Client;
}

