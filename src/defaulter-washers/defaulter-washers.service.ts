import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DefaulterWasher } from './entities/defaulter-washers.entity';
import { CreateDefaulterWasherDto, UpdateDefaulterWasherDto } from './dto/create-defaulter-washer.dto';

@Injectable()
export class DefaulterWashersService {
  constructor(
    @InjectRepository(DefaulterWasher)
    private readonly defaulterWasherRepository: Repository<DefaulterWasher>,
  ) {}

  async getDefaulterWashers(startDate?: string, endDate?: string): Promise<DefaulterWasher[]> {
    const queryBuilder = this.defaulterWasherRepository
      .createQueryBuilder('defaulterWasher')
      .leftJoinAndSelect('defaulterWasher.washer', 'washer');

    if (startDate && endDate) {
      queryBuilder.where('defaulterWasher.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    queryBuilder.orderBy('defaulterWasher.createAt', 'DESC');

    return queryBuilder.getMany();
  }

  async getDefaulterWasherById(id: string): Promise<DefaulterWasher> {
    const defaulterWasher = await this.defaulterWasherRepository.findOne({
      where: { id },
      relations: ['washer'],
    });

    if (!defaulterWasher) {
      throw new NotFoundException(`Lavador en mora con ID ${id} no encontrado`);
    }

    return defaulterWasher;
  }

  async createDefaulterWasher(createDto: CreateDefaulterWasherDto): Promise<DefaulterWasher> {
    const defaulterWasher = this.defaulterWasherRepository.create({
      ...createDto,
      date: createDto.date || new Date(),
    });

    return this.defaulterWasherRepository.save(defaulterWasher);
  }

  async updateDefaulterWasher(id: string, updateDto: UpdateDefaulterWasherDto): Promise<DefaulterWasher> {
    const defaulterWasher = await this.getDefaulterWasherById(id);

    Object.assign(defaulterWasher, updateDto);

    return this.defaulterWasherRepository.save(defaulterWasher);
  }

  async deleteDefaulterWasher(id: string): Promise<void> {
    const result = await this.defaulterWasherRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Lavador en mora con ID ${id} no encontrado`);
    }
  }

  async markAsPaid(id: string): Promise<DefaulterWasher> {
    const defaulterWasher = await this.getDefaulterWasherById(id);
    
    defaulterWasher.isPaid = true;
    
    return this.defaulterWasherRepository.save(defaulterWasher);
  }
}
