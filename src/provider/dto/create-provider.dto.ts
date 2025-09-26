export class CreateProviderDto {
    name: string;
    phone: string;
    state?: number;
}

export class UpdateProviderDto {
    name?: string;
    phone?: string;
    state?: number;
}
