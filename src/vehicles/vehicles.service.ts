import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { TypeVehicle } from 'src/entities/type-vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(TypeVehicle)
    private typeVehicleRepository: Repository<TypeVehicle>,
  ) {}

  async getVehicles() {
    return this.vehicleRepository.find({
      where: { state: 1 },
      relations: ['typeVehicle'],
      order: { id: 'DESC' },
    });
  }

  async getVehicleById(id: number) {
    return this.vehicleRepository.findOne({
      where: { id },
      relations: ['typeVehicle'],
    });
  }

  async createVehicle(vehicle: CreateVehicleDto) {
    const typeVehicle = await this.typeVehicleRepository.findOne({
      where: { id: Number(vehicle.typeVehicleId) },
    });
    if (!typeVehicle) {
      throw new Error('typeVehicle not found');
    }
    const newVehicle = this.vehicleRepository.create({
      ...vehicle,
      typeVehicle,
    });
    return this.vehicleRepository.save(newVehicle);
  }

  async updateVehicle(id: number, vehicle: CreateVehicleDto) {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['typeVehicle'],
    });
    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }
    const typeVehicle = await this.typeVehicleRepository.findOne({
      where: { id: Number(vehicle.typeVehicleId) },
    });
    if (!typeVehicle) {
      throw new Error('typeVehicle not found');
    }
    const updatedVehicle = {
      ...existingVehicle,
      ...vehicle,
      typeVehicle,
    };
    return this.vehicleRepository.save(updatedVehicle);
  }

  async deleteVehicle(id: number) {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { id },
    });
    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }
    existingVehicle.state = 0;
    return this.vehicleRepository.save(existingVehicle);
  }
}
