import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from 'src/vehicles/dto/create-vehicle.dto';
import { IVehiclesRepository, VEHICLES_REPOSITORY_TOKEN } from 'src/vehicles/interfaces/vehicles-manager.interface';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(
    @Inject(VEHICLES_REPOSITORY_TOKEN)
    private readonly vehiclesRepository: IVehiclesRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getVehicles(): Promise<Vehicle[]> {
    this.logger.log('Fetching all active vehicles');

    try {
      return await this.vehiclesRepository.findAll();
    } catch (error) {
      this.logger.error('Error fetching vehicles', error.stack);
      throw error;
    }
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    this.logger.log(`Fetching vehicle with ID: ${id}`);

    try {
      const vehicle = await this.vehiclesRepository.findById(id);
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${id} not found`);
      }
      return vehicle;
    } catch (error) {
      this.logger.error(`Error fetching vehicle with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async findByPlate(plate: string): Promise<Vehicle | null> {
    this.logger.log(`Fetching vehicle with plate: ${plate}`);

    try {
      return await this.vehiclesRepository.findByPlate(plate);
    } catch (error) {
      this.logger.error(`Error fetching vehicle with plate: ${plate}`, error.stack);
      throw error;
    }
  }

  async createVehicle(vehicleData: CreateVehicleDto): Promise<Vehicle> {
    this.logger.log(`Creating new vehicle with plate: ${vehicleData.plate}`);
    return this.dataSource.transaction(async (manager) => {
      try {
        // Check if plate already exists
        const existingVehicle = await this.vehiclesRepository.findByPlate(vehicleData.plate);
        if (existingVehicle) {
          throw new Error('La placa ya existe en la base de datos');
        }        
        const vehicle = await this.vehiclesRepository.create(vehicleData);
        this.logger.log(`Vehicle created successfully with ID: ${vehicle.id}`);
        return vehicle;
      } catch (error) {
        this.logger.error('Error creating vehicle', error.stack);
        throw error;
      }
    });
  }

  async updateVehicle(id: string, vehicleData: UpdateVehicleDto): Promise<Vehicle> {
    this.logger.log(`Updating vehicle with ID: ${id}`);
    return this.dataSource.transaction(async (manager) => {
      try {
        // Check if vehicle exists
        await this.getVehicleById(id);
        const updatedVehicle = await this.vehiclesRepository.update(id, vehicleData);
        this.logger.log(`Vehicle updated successfully: ${id}`);
        return updatedVehicle;
      } catch (error) {
        this.logger.error(`Error updating vehicle with ID: ${id}`, error.stack);
        throw error;
      }
    });
  }

  async deleteVehicle(id: string): Promise<void> {
    this.logger.log(`Soft deleting vehicle with ID: ${id}`);
    try {
      await this.vehiclesRepository.softDelete(id);
      this.logger.log(`Vehicle soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error soft deleting vehicle with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async hardDeleteVehicle(id: string): Promise<void> {
    this.logger.log(`Hard deleting vehicle with ID: ${id}`);
    try {
      const result = await this.vehiclesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Vehicle with ID ${id} not found`);
      }
      this.logger.log(`Vehicle hard deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error hard deleting vehicle with ID: ${id}`, error.stack);
      throw error;
    }
  }
}
