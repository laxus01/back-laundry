import { Service } from '../entities/services.entity';
import { CreateServiceDto, UpdateServiceDto } from '../dto/create-service.dto';
import { DeleteResult } from 'typeorm';

export interface IServicesRepository {
  findAll(): Promise<Service[]>;
  findById(id: string): Promise<Service | null>;
  create(service: CreateServiceDto): Promise<Service>;
  update(id: string, service: UpdateServiceDto): Promise<Service>;
  delete(id: string): Promise<DeleteResult>;
  softDelete(id: string): Promise<Service>;
  findByName(service: string): Promise<Service | null>;
}

export const SERVICES_REPOSITORY_TOKEN = 'SERVICES_REPOSITORY';