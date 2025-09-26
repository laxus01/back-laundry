import { Injectable, Logger, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProviderDto, UpdateProviderDto } from './dto/create-provider.dto';
import { Provider } from './entities/provider.entity';
import { IProvidersRepository, PROVIDERS_REPOSITORY_TOKEN } from './interfaces/providers-manager.interface';

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProvidersService.name);

  constructor(
    @Inject(PROVIDERS_REPOSITORY_TOKEN)
    private readonly providersRepository: IProvidersRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getProviders(): Promise<Provider[]> {
    this.logger.log('Fetching all providers');
    
    return this.providersRepository.findAll();
  }

  async getProviderById(id: string): Promise<Provider | null> {
    this.logger.log(`Fetching provider with ID: ${id}`);
    
    return this.providersRepository.findById(id);
  }

  async createProvider(providerData: CreateProviderDto): Promise<Provider> {
    this.logger.log(`Creating new provider: ${providerData.name}`);

    return this.dataSource.transaction(async (manager) => {
      // Create the provider
      const provider = await this.providersRepository.create(providerData);
      
      this.logger.log(`Provider created successfully with ID: ${provider.id}`);
      return provider;
    });
  }

  async updateProvider(id: string, providerData: UpdateProviderDto): Promise<Provider> {
    this.logger.log(`Updating provider with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Update the provider record
      const updatedProvider = await this.providersRepository.update(id, providerData);
      
      this.logger.log(`Provider updated successfully: ${id}`);
      return updatedProvider;
    });
  }

  async deleteProvider(id: string): Promise<void> {
    this.logger.log(`Deleting provider with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Delete the provider
      await this.providersRepository.delete(id);
      
      this.logger.log(`Provider deleted successfully: ${id}`);
    });
  }
}
