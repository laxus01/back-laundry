import { Injectable, Inject } from '@nestjs/common';
import { CreateAdvanceDto, UpdateAdvanceDto } from './dto/create-advance.dto';
import { IAdvancesRepository, ADVANCES_REPOSITORY_TOKEN } from './interfaces/advances-manager.interface';

@Injectable()
export class AdvancesService {
  constructor(
    @Inject(ADVANCES_REPOSITORY_TOKEN)
    private readonly advancesRepository: IAdvancesRepository,
  ) {}

  async getAdvances() {
    return this.advancesRepository.getAdvances();
  }

  async getAdvanceById(id: string) {
    return this.advancesRepository.getAdvanceById(id);
  }

  async createAdvance(advance: CreateAdvanceDto) {
    return this.advancesRepository.createAdvance(advance);
  }

  async updateAdvance(id: string, advance: UpdateAdvanceDto) {
    return this.advancesRepository.updateAdvance(id, advance);
  }

  async deleteAdvance(id: string) {
    return this.advancesRepository.deleteAdvance(id);
  }

  async getAdvancesByWasherAndDateRange(washerId: string, startDate: Date, endDate: Date) {
    return this.advancesRepository.getAdvancesByWasherAndDateRange(washerId, startDate, endDate);
  }
}
