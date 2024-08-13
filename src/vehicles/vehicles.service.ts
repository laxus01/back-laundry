import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
  ) {}

  async getVehicles() {
    return this.vehicleRepository.find({ relations: ['typeVehicle'] });
  }
}
