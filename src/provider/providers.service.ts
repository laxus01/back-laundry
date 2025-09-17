import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from 'src/provider/entities/provider.entity';
import { Repository } from 'typeorm';
import { CreateProviderDto } from './dto/create-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider) private providerRepository: Repository<Provider>,
  ) {}

  async getProviders() {
    return this.providerRepository.find();
  }

  async getProviderById(id: string) {
    return this.providerRepository.findOne({
      where: { id },
    });
  }

  async createProvider(provider: CreateProviderDto) {
    const newProvider = this.providerRepository.create(provider);
    return this.providerRepository.save(newProvider);
  }

  async updateProvider(id: string, provider: CreateProviderDto) {
    const existingProvider = await this.providerRepository.findOne({
      where: { id },
    });
    if (!existingProvider) {
      throw new Error('Provider not found');
    }
    const updatedProvider = { ...existingProvider, ...provider };
    return this.providerRepository.save(updatedProvider);
  }

  async deleteProvider(id: string) {
    const existingProvider = await this.providerRepository.findOne({
      where: { id },
    });
    if (!existingProvider) {
      throw new Error('Provider not found');
    }
    return this.providerRepository.remove(existingProvider);
  }
}
