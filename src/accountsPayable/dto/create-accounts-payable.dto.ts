import { Provider } from "src/provider/entities/provider.entity";

export class CreateAccountsPayableDto {
  value: number;
  date: Date;
  detail: string;
  providerId: Provider;
}

export class UpdateAccountsPayableDto {
    value?: number;
    date?: Date;
    detail?: string;
    providerId?: Provider;
}

