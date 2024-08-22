import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attention } from 'src/entities/attentions.entity';
import { Repository } from 'typeorm';
import { CreateAttentionDto } from './dto/attention.create-attention.dto';

@Injectable()
export class AttentionsService {
  constructor(
    @InjectRepository(Attention) private attentionRepository: Repository<Attention>,
  ) {}

  async getAttentions() {
    return this.attentionRepository.find({ relations: ['vehicleId', 'washerId'] });
  }

  async getAttentionById(id: number) {
    return this.attentionRepository.findOne({
      where: { id },
      relations: ['vehicleId', 'washerId'],
    });
  }

  async createAttention(attention: CreateAttentionDto) {
    const newAttention = this.attentionRepository.create(attention);
    return this.attentionRepository.save(newAttention);
  }

  async updateAttention(id: number, attention: CreateAttentionDto) {
    const existingAttention = await this.attentionRepository.findOne({
      where: { id },
    });
    if (!existingAttention) {
      throw new Error('Attention not found');
    }
    const updatedAttention = { ...existingAttention, ...attention };
    return this.attentionRepository.save(updatedAttention);
  }

  async deleteAttention(id: number) {
    const existingAttention = await this.attentionRepository.findOne({
      where: { id },
    });
    if (!existingAttention) {
      throw new Error('Attention not found');
    }
    return this.attentionRepository.remove(existingAttention);
  }
}
