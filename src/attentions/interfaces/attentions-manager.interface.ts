import { Attention } from '../entities/attentions.entity';
import { CreateAttentionDto, UpdateAttentionDto } from '../dto/attention.create-attention.dto';
import { DeleteResult } from 'typeorm';

export interface IAttentionsRepository {
  findAll(): Promise<Attention[]>;
  findById(id: string): Promise<Attention | null>;
  create(attention: CreateAttentionDto): Promise<Attention>;
  update(id: string, attention: UpdateAttentionDto): Promise<Attention>;
  delete(id: string): Promise<DeleteResult>;
  // Agregar métodos específicos si son necesarios
}

export const ATTENTIONS_REPOSITORY_TOKEN = 'ATTENTIONS_REPOSITORY';