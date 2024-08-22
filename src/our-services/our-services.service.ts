import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OurService } from 'src/entities/our-services.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class OurServicesService {
  constructor(
    @InjectRepository(OurService) private servicesRepository: Repository<OurService>,
  ) {}

  async getServices() {
    return this.servicesRepository.find();
  }

  async getServiceById(id: number) {
    return this.servicesRepository.findOne({
      where: { id },
    });
  }

  async createService(service: CreateServiceDto) {
    const newService = this.servicesRepository.create(service);
    return this.servicesRepository.save(newService);
  }

  async updateService(id: number, service: CreateServiceDto) {
    const existingService = await this.servicesRepository.findOne({
      where: { id },
    });
    if (!existingService) {
      throw new Error('Service not found');
    }
    const updatedService = { ...existingService, ...service };
    return this.servicesRepository.save(updatedService);
  }

  async deleteService(id: number) {
    const existingService = await this.servicesRepository.findOne({
      where: { id },
    });
    if (!existingService) {
      throw new Error('Service not found');
    }
    return this.servicesRepository.remove(existingService);
  }
}