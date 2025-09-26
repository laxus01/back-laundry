import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto/create-vehicle.dto';
import { DeleteResult } from 'typeorm';

export interface IVehiclesRepository {
  findAll(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  create(vehicle: CreateVehicleDto): Promise<Vehicle>;
  update(id: string, vehicle: UpdateVehicleDto): Promise<Vehicle>;
  delete(id: string): Promise<DeleteResult>;
  softDelete(id: string): Promise<Vehicle>;
  findByPlate(plate: string): Promise<Vehicle | null>;
}

export const VEHICLES_REPOSITORY_TOKEN = 'VEHICLES_REPOSITORY';