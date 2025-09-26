import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Service } from './entities/services.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';
import { IServicesRepository, SERVICES_REPOSITORY_TOKEN } from './interfaces/services-manager.interface';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    @Inject(SERVICES_REPOSITORY_TOKEN)
    private readonly servicesRepository: IServicesRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getServices(): Promise<Service[]> {
    this.logger.log('Fetching all active services');

    try {
      return await this.servicesRepository.findAll();
    } catch (error) {
      this.logger.error('Error fetching services', error.stack);
      throw error;
    }
  }

  async getServiceById(id: string): Promise<Service | null> {
    this.logger.log(`Fetching service with ID: ${id}`);

    try {
      const service = await this.servicesRepository.findById(id);
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      return service;
    } catch (error) {
      this.logger.error(`Error fetching service with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async findByName(service: string): Promise<Service | null> {
    this.logger.log(`Fetching service with name: ${service}`);

    try {
      return await this.servicesRepository.findByName(service);
    } catch (error) {
      this.logger.error(`Error fetching service with name: ${service}`, error.stack);
      throw error;
    }
  }

  async createService(serviceData: CreateServiceDto): Promise<Service> {
    this.logger.log(`Creating new service: ${serviceData.service}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        // Check if service name already exists
        const existingService = await this.servicesRepository.findByName(serviceData.service);
        if (existingService) {
          throw new Error('El nombre del servicio ya existe en la base de datos');
        }

        const service = await this.servicesRepository.create(serviceData);
        this.logger.log(`Service created successfully with ID: ${service.id}`);
        return service;
      } catch (error) {
        this.logger.error('Error creating service', error.stack);
        throw error;
      }
    });
  }

  async updateService(id: string, serviceData: UpdateServiceDto): Promise<Service> {
    this.logger.log(`Updating service with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        // Check if service exists
        await this.getServiceById(id);

        const updatedService = await this.servicesRepository.update(id, serviceData);
        this.logger.log(`Service updated successfully: ${id}`);
        return updatedService;
      } catch (error) {
        this.logger.error(`Error updating service with ID: ${id}`, error.stack);
        throw error;
      }
    });
  }

  async deleteService(id: string): Promise<void> {
    this.logger.log(`Soft deleting service with ID: ${id}`);

    try {
      await this.servicesRepository.softDelete(id);
      this.logger.log(`Service soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error soft deleting service with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async hardDeleteService(id: string): Promise<void> {
    this.logger.log(`Hard deleting service with ID: ${id}`);

    try {
      const result = await this.servicesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      this.logger.log(`Service hard deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error hard deleting service with ID: ${id}`, error.stack);
      throw error;
    }
  }
}