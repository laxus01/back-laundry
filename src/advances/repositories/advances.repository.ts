import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Advance } from '../entities/advances.entity';
import { CreateAdvanceDto, UpdateAdvanceDto } from '../dto/create-advance.dto';
import { IAdvancesRepository } from '../interfaces/advances-manager.interface';

@Injectable()
export class AdvancesRepository implements IAdvancesRepository {
  constructor(
    @InjectRepository(Advance)
    private readonly advanceRepository: Repository<Advance>,
  ) {}

  async getAdvances(): Promise<Advance[]> {
    return this.advanceRepository.find({
      where: { state: 1 },
      relations: ['washer'],
      order: { createAt: 'DESC' },
    });
  }

  async getAdvanceById(id: string): Promise<Advance> {
    const advance = await this.advanceRepository.findOne({
      where: { id, state: 1 },
      relations: ['washer'],
    });
    if (!advance) {
      throw new NotFoundException(`Advance with ID ${id} not found`);
    }
    return advance;
  }

  async createAdvance(advance: CreateAdvanceDto): Promise<Advance> {
    const newAdvance = this.advanceRepository.create(advance);
    return this.advanceRepository.save(newAdvance);
  }

  async updateAdvance(id: string, advance: UpdateAdvanceDto): Promise<Advance> {
    const existingAdvance = await this.getAdvanceById(id);
    const updatedAdvance = this.advanceRepository.merge(existingAdvance, advance);
    return this.advanceRepository.save(updatedAdvance);
  }

  async deleteAdvance(id: string): Promise<void> {
    const advance = await this.getAdvanceById(id);
    advance.state = 0;
    await this.advanceRepository.save(advance);
  }

  async getAdvancesByWasherAndDateRange(
    washerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Advance[]> {
    return this.advanceRepository.find({
      where: {
        washerId,
        state: 1,
        date: Between(startDate, endDate),
      },
      relations: ['washer'],
    });
  }
}
