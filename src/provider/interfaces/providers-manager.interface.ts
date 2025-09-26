import { Provider } from "../entities/provider.entity";
import { CreateProviderDto, UpdateProviderDto } from "../dto/create-provider.dto";

export interface IProvidersRepository {
  findAll(): Promise<Provider[]>;
  findById(id: string): Promise<Provider | null>;
  create(providerData: CreateProviderDto): Promise<Provider>;
  update(id: string, providerData: UpdateProviderDto): Promise<Provider>;
  delete(id: string): Promise<void>;
}

// Token for dependency injection
export const PROVIDERS_REPOSITORY_TOKEN = 'PROVIDERS_REPOSITORY_TOKEN';
