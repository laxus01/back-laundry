import { Client } from "../entities/clients.entity";
import { CreateClientDto, UpdateClientDto } from "../dto/create-client.dto";

export interface IClientsRepository {
  findAll(): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  create(clientData: CreateClientDto): Promise<Client>;
  update(id: string, clientData: UpdateClientDto): Promise<Client>;
  delete(id: string): Promise<void>;
}

// Token for dependency injection
export const CLIENTS_REPOSITORY_TOKEN = 'CLIENTS_REPOSITORY_TOKEN';
