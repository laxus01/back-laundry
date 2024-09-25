import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
  ) {}

  async getVehicles() {
    return this.vehicleRepository.find({ relations: ['typeVehicleId'] });
  }

  async getVehicleById(id: number) {
    return this.vehicleRepository.findOne({
      where: { id },
      relations: ['typeVehicleId'],
    });
  }

  async createVehicle(vehicle: CreateVehicleDto) {
    const newVehicle = this.vehicleRepository.create(vehicle);
    return this.vehicleRepository.save(newVehicle);
  }

  async updateVehicle(id: number, vehicle: CreateVehicleDto) {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { id },
    });
    
    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }
    const updatedVehicle = { ...existingVehicle, ...vehicle };
    return this.vehicleRepository.save(updatedVehicle);
  }

  async deleteVehicle(id: number) {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { id },
    });
    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }
    return this.vehicleRepository.remove(existingVehicle);
  }
}
