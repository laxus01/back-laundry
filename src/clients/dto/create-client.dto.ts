export class CreateClientDto {
    client: string;
    phone: string;
    state?: number;
}

export class UpdateClientDto {
    client?: string;
    phone?: string;
    state?: number;
}