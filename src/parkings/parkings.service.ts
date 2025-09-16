import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from 'src/parkings/entities/parkings.entity';
import { Repository } from 'typeorm';
import { CreateParkingDto } from './dto/parking.dto';
import { Logger } from '@nestjs/common';
import * as cron from 'cron';

@Injectable()
export class ParkingsService {
  constructor(
    @InjectRepository(Parking) private parkingRepository: Repository<Parking>,
  ) {}

  async getParkings() {
    return this.parkingRepository.find({ 
      where: { state: 1 },
      relations: ['vehicle', 'vehicle.typeVehicle', 'typeParking', 'parkingPayments'] 
    });
  }

  async getParkingById(id: string) {
    return this.parkingRepository.findOne({
      where: { id },
      relations: ['vehicle', 'vehicle.typeVehicle', 'typeParking', 'parkingPayments'],
    });
  }

  async createParking(parking: CreateParkingDto) {
    const newParking = this.parkingRepository.create(parking);
    return this.parkingRepository.save(newParking);
  }

  async updateParking(id: string, parking: CreateParkingDto) {
    const existingParking = await this.parkingRepository.findOne({
      where: { id },
    });
    if (!existingParking) {
      throw new Error('Parking not found');
    }
    const updatedParking = { ...existingParking, ...parking };
    return this.parkingRepository.save(updatedParking);
  }

  async deleteParking(id: string) {
    const existingParking = await this.parkingRepository.findOne({
      where: { id },  
    });
    if (!existingParking) {
      throw new Error('Parking not found');
    }
    return this.parkingRepository.remove(existingParking);
  }

  async insertAllParkings() {
    const query = `
      INSERT INTO parkings (dateInitial, dateFinal, value, typeParkingId, vehicleId, paymentStatus)
      SELECT  DATE_ADD(MAX(dateInitial), INTERVAL +1 MONTH), DATE_ADD(MAX(dateFinal), INTERVAL +1 MONTH), value, typeParkingId, vehicleId, paymentStatus
      FROM parkings
      WHERE typeParkingId = 2 AND state = 1 
      GROUP BY vehicleId;
    `;
    try {
      await this.parkingRepository.query(query);
    } catch (error) {
      throw new Error('Error inserting all parkings: ' + error.message);
    }
  }

  setupMonthlyCron() {
    const CronJob = cron.CronJob;    
    const job = new CronJob('0 0 0 1 * *', () => {
      this.insertAllParkings()     
    });    
    job.start();
  }
}
