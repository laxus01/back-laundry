import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from 'src/entities/parkings.entity';
import { Repository } from 'typeorm';
import { CreateParkingDto } from './dto/parking.dto';

@Injectable()
export class ParkingsService {
  constructor(
    @InjectRepository(Parking) private parkingRepository: Repository<Parking>,
  ) {}

  async getParkings() {
    return this.parkingRepository.find({ relations: ['vehicleId'] });
  }

  async getParkingById(id: number) {
    return this.parkingRepository.findOne({
      where: { id },
      relations: ['vehicleId'],
    });
  }

  async createParking(parking: CreateParkingDto) {
    const newParking = this.parkingRepository.create(parking);
    return this.parkingRepository.save(newParking);
  }

  async updateParking(id: number, parking: CreateParkingDto) {
    const existingParking = await this.parkingRepository.findOne({
      where: { id },
    });
    if (!existingParking) {
      throw new Error('Parking not found');
    }
    const updatedParking = { ...existingParking, ...parking };
    return this.parkingRepository.save(updatedParking);
  }

  async deleteParking(id: number) {
    const existingParking = await this.parkingRepository.findOne({
      where: { id },
    });
    if (!existingParking) {
      throw new Error('Parking not found');
    }
    return this.parkingRepository.remove(existingParking);
  }
}
