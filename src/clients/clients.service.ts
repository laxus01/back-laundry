import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entities/clients.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  async getClients() {
    return this.clientRepository.find();
  }

  async getClientById(id: number) {
    return this.clientRepository.findOne({
      where: { id },
    });
  }

  async createClient(client: CreateClientDto) {
    const newClient = this.clientRepository.create(client);
    return this.clientRepository.save(newClient);
  }

  async updateClient(id: number, client: CreateClientDto) {
    const existingClient = await this.clientRepository.findOne({
      where: { id },
    });
    if (!existingClient) {
      throw new Error('Client not found');
    }
    const updatedClient = { ...existingClient, ...client };
    return this.clientRepository.save(updatedClient);
  }

  async deleteClient(id: number) {
    const existingClient = await this.clientRepository.findOne({
      where: { id },
    });
    if (!existingClient) {
      throw new Error('Client not found');
    }
    return this.clientRepository.remove(existingClient);
  }
}