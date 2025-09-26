import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/clients.entity';
import { CreateClientDto, UpdateClientDto } from '../dto/create-client.dto';
import { IClientsRepository } from '../interfaces/clients-manager.interface';

@Injectable()
export class ClientsRepository implements IClientsRepository {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({
      order: { createAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.clientRepository.findOne({
      where: { id },
    });

    return client || null;
  }

  async create(clientData: CreateClientDto): Promise<Client> {
    const newClient = this.clientRepository.create({
      ...clientData,
      state: clientData.state ?? 1, // Default state to 1 if not provided
    });

    return this.clientRepository.save(newClient);
  }

  async update(id: string, clientData: UpdateClientDto): Promise<Client> {
    const existingClient = await this.findById(id);
    
    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // Merge the existing client with the update data
    const updatedClient = this.clientRepository.merge(existingClient, clientData);
    
    return this.clientRepository.save(updatedClient);
  }

  async delete(id: string): Promise<void> {
    const existingClient = await this.findById(id);
    
    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    await this.clientRepository.remove(existingClient);
  }
}
