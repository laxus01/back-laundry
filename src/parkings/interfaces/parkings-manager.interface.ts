import { Parking } from '../entities/parkings.entity';
import { CreateParkingDto, UpdateParkingDto } from '../dto/parking.dto';
import { DeleteResult } from 'typeorm';

export interface IParkingsRepository {
  findAll(): Promise<Parking[]>;
  findById(id: string): Promise<Parking | null>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Parking[]>;
  create(parking: CreateParkingDto): Promise<Parking>;
  update(id: string, parking: UpdateParkingDto): Promise<Parking>;
  delete(id: string): Promise<DeleteResult>;
  softDelete(id: string): Promise<Parking>;
  findByVehicleId(vehicleId: string): Promise<Parking[]>;
  insertAllParkings(): Promise<void>;
}

export const PARKINGS_REPOSITORY_TOKEN = 'PARKINGS_REPOSITORY';
