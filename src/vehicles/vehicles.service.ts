import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { TypeVehicle } from 'src/vehicles/entities/type-vehicle.entity';

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

  async getVehicleById(id: string) {
    return this.vehicleRepository.findOne({
      where: { id: String(id) },
      relations: ['typeVehicle'],
    });
  }

  async createVehicle(vehicle: CreateVehicleDto) {
    // Check if plate already exists
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate: vehicle.plate },
    });
    
    if (existingVehicle) {
      return {
        success: false,
        message: 'La placa ya existe en la base de datos',
        data: null,
        statusCode: 409
      };
    }

    const typeVehicle = await this.typeVehicleRepository.findOne({
      where: { id: Number(vehicle.typeVehicleId) },
    });
    
    const newVehicle = this.vehicleRepository.create({
      ...vehicle,
      typeVehicle,
    });
    
    const savedVehicle = await this.vehicleRepository.save(newVehicle);
    
    return {
      success: true,
      message: 'Vehículo creado exitosamente',
      data: savedVehicle,
      statusCode: 201
    };
  }

  async updateVehicle(id: string, vehicle: CreateVehicleDto) {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { id: String(id) },
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

  async deleteVehicle(id: string) {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { id: String(id) },
    });
    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }
    existingVehicle.state = 0;
    return this.vehicleRepository.save(existingVehicle);
  }
}
