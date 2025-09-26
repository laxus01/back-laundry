import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Service } from '../entities/services.entity';
import { CreateServiceDto, UpdateServiceDto } from '../dto/create-service.dto';
import { IServicesRepository, SERVICES_REPOSITORY_TOKEN } from '../interfaces/services-manager.interface';

@Injectable()
export class ServicesRepository implements IServicesRepository {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find({
      where: { state: 1 },
      order: { createAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.servicesRepository.findOne({
      where: { id: String(id) },
    });

    return service || null;
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const newService = this.servicesRepository.create({
      ...createServiceDto,
      state: createServiceDto.state ?? 1, // Default state to 1 if not provided
    });

    return this.servicesRepository.save(newService);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const existingService = await this.findById(id);

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    // Merge the existing service with the update data
    const updatedService = this.servicesRepository.merge(existingService, updateServiceDto);

    return this.servicesRepository.save(updatedService);
  }

  async delete(id: string): Promise<DeleteResult> {
    const existingService = await this.findById(id);

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return this.servicesRepository.delete(id);
  }

  async softDelete(id: string): Promise<Service> {
    const existingService = await this.findById(id);

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    // Soft delete by setting state to 0
    existingService.state = 0;
    return this.servicesRepository.save(existingService);
  }

  async findByName(service: string): Promise<Service | null> {
    const foundService = await this.servicesRepository.findOne({
      where: { service },
    });

    return foundService || null;
  }
}