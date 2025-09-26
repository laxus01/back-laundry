import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../entities/provider.entity';
import { CreateProviderDto, UpdateProviderDto } from '../dto/create-provider.dto';
import { IProvidersRepository } from '../interfaces/providers-manager.interface';

@Injectable()
export class ProvidersRepository implements IProvidersRepository {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async findAll(): Promise<Provider[]> {
    return this.providerRepository.find({
      order: { createAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<Provider | null> {
    const provider = await this.providerRepository.findOne({
      where: { id },
    });

    return provider || null;
  }

  async create(providerData: CreateProviderDto): Promise<Provider> {
    const newProvider = this.providerRepository.create({
      ...providerData,
      state: providerData.state ?? 1, // Default state to 1 if not provided
    });

    return this.providerRepository.save(newProvider);
  }

  async update(id: string, providerData: UpdateProviderDto): Promise<Provider> {
    const existingProvider = await this.findById(id);
    
    if (!existingProvider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }

    // Merge the existing provider with the update data
    const updatedProvider = this.providerRepository.merge(existingProvider, providerData);
    
    return this.providerRepository.save(updatedProvider);
  }

  async delete(id: string): Promise<void> {
    const existingProvider = await this.findById(id);
    
    if (!existingProvider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }

    await this.providerRepository.remove(existingProvider);
  }
}
