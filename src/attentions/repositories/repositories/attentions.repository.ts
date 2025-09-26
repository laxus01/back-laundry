import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Attention } from '../../entities/attentions.entity';
import { IAttentionsRepository, ATTENTIONS_REPOSITORY_TOKEN } from '../../interfaces/attentions-manager.interface';
import { CreateAttentionDto, UpdateAttentionDto } from '../../dto/attention.create-attention.dto';

@Injectable()
export class AttentionsRepository implements IAttentionsRepository {
  constructor(
    @InjectRepository(Attention)
    private readonly repository: Repository<Attention>,
  ) {}

  async findAll(): Promise<Attention[]> {
    return this.repository.find({
      relations: ['client', 'vehicle', 'services', 'products'],
      order: { createAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Attention | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['client', 'vehicle', 'services', 'products'],
    });
  }

  async create(createAttentionDto: CreateAttentionDto): Promise<Attention> {
    const attention = this.repository.create(createAttentionDto);
    return this.repository.save(attention);
  }

  async update(id: string, updateAttentionDto: UpdateAttentionDto): Promise<Attention> {
    await this.repository.update(id, updateAttentionDto);
    return this.repository.findOneOrFail({ where: { id } });
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}