import { Provider } from "../../provider/entities/provider.entity";

export class CreateAccountsPayableDto {
  value: number;
  date: Date;
  detail: string;
  providerId: string | Provider;
}

export class UpdateAccountsPayableDto {
    value?: number;
    date?: Date;
    detail?: string;
    providerId?: string | Provider;
}
