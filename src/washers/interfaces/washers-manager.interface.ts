import { Washer } from '../entities/washers.entity';
import { CreateWasherDto, UpdateWasherDto } from '../dto/washers.dto';
import { DeleteResult } from 'typeorm';

export interface IWashersRepository {
  findAll(): Promise<Washer[]>;
  findById(id: string): Promise<Washer | null>;
  create(washer: CreateWasherDto): Promise<Washer>;
  update(id: string, washer: UpdateWasherDto): Promise<Washer>;
  delete(id: string): Promise<DeleteResult>;
  softDelete(id: string): Promise<Washer>;
  findByPhone(phone: string): Promise<Washer | null>;
}

export const WASHERS_REPOSITORY_TOKEN = 'WASHERS_REPOSITORY';