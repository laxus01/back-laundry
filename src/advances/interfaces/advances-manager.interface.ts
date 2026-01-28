import { Advance } from '../entities/advances.entity';
import { CreateAdvanceDto, UpdateAdvanceDto } from '../dto/create-advance.dto';

export const ADVANCES_REPOSITORY_TOKEN = 'ADVANCES_REPOSITORY';

export interface IAdvancesRepository {
  getAdvances(): Promise<Advance[]>;
  getAdvanceById(id: string): Promise<Advance>;
  createAdvance(advance: CreateAdvanceDto): Promise<Advance>;
  updateAdvance(id: string, advance: UpdateAdvanceDto): Promise<Advance>;
  deleteAdvance(id: string): Promise<void>;
  getAdvancesByWasherAndDateRange(washerId: string, startDate: Date, endDate: Date): Promise<Advance[]>;
}
