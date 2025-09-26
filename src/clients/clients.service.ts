import { Injectable, Logger, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateClientDto, UpdateClientDto } from './dto/create-client.dto';
import { Client } from './entities/clients.entity';
import { IClientsRepository, CLIENTS_REPOSITORY_TOKEN } from './interfaces/clients-manager.interface';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @Inject(CLIENTS_REPOSITORY_TOKEN)
    private readonly clientsRepository: IClientsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getClients(): Promise<Client[]> {
    this.logger.log('Fetching all clients');
    
    return this.clientsRepository.findAll();
  }

  async getClientById(id: string): Promise<Client | null> {
    this.logger.log(`Fetching client with ID: ${id}`);
    
    return this.clientsRepository.findById(id);
  }

  async createClient(clientData: CreateClientDto): Promise<Client> {
    this.logger.log(`Creating new client: ${clientData.client}`);

    return this.dataSource.transaction(async (manager) => {
      // Create the client
      const client = await this.clientsRepository.create(clientData);
      
      this.logger.log(`Client created successfully with ID: ${client.id}`);
      return client;
    });
  }

  async updateClient(id: string, clientData: UpdateClientDto): Promise<Client> {
    this.logger.log(`Updating client with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Update the client record
      const updatedClient = await this.clientsRepository.update(id, clientData);
      
      this.logger.log(`Client updated successfully: ${id}`);
      return updatedClient;
    });
  }

  async deleteClient(id: string): Promise<void> {
    this.logger.log(`Deleting client with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Delete the client
      await this.clientsRepository.delete(id);
      
      this.logger.log(`Client deleted successfully: ${id}`);
    });
  }
}