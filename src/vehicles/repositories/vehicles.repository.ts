import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { TypeVehicle } from '../entities/type-vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto/create-vehicle.dto';
import { IVehiclesRepository, VEHICLES_REPOSITORY_TOKEN } from '../interfaces/vehicles-manager.interface';

@Injectable()
export class VehiclesRepository implements IVehiclesRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(TypeVehicle)
    private readonly typeVehicleRepository: Repository<TypeVehicle>,
  ) {}

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { state: 1 },
      relations: ['typeVehicle'],
      order: { createAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: String(id) },
      relations: ['typeVehicle'],
    });

    return vehicle || null;
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate: createVehicleDto.plate },
    });
    
    if (existingVehicle) {
      throw new Error('La placa ya existe en la base de datos');
    }

    const typeVehicle = await this.typeVehicleRepository.findOne({
      where: { id: String(createVehicleDto.typeVehicleId) },
    });
    
    const newVehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      typeVehicle,
    });
    
    const savedVehicle = await this.vehicleRepository.save(newVehicle);
    return savedVehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.findById(id);

    if (!existingVehicle) {
      throw new NotFoundException(`No se encontro el vehiculo con el id ${id}`);
    }

    // Merge the existing vehicle with the update data
    const updatedVehicle = this.vehicleRepository.merge(existingVehicle, updateVehicleDto);

    return this.vehicleRepository.save(updatedVehicle);
  }

  async delete(id: string): Promise<DeleteResult> {
    const existingVehicle = await this.findById(id);

    if (!existingVehicle) {
      throw new NotFoundException(`No se encontro el vehiculo con el id ${id}`);
    }

    return this.vehicleRepository.delete(id);
  }

  async softDelete(id: string): Promise<Vehicle> {
    const existingVehicle = await this.findById(id);

    if (!existingVehicle) {
      throw new NotFoundException(`No se encontro el vehiculo con el id ${id}`);
    }

    // Soft delete by setting state to 0
    existingVehicle.state = 0;
    return this.vehicleRepository.save(existingVehicle);
  }

  async findByPlate(plate: string): Promise<Vehicle | null> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate },
      relations: ['typeVehicle'],
    });

    return vehicle || null;
  }
}