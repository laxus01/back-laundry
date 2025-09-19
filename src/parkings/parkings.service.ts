import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from 'src/parkings/entities/parkings.entity';
import { Repository } from 'typeorm';
import { CreateParkingDto } from './dto/parking.dto';
import * as cron from 'cron';
import * as dayjs from 'dayjs';

@Injectable()
export class ParkingsService {
  constructor(
    @InjectRepository(Parking) private parkingRepository: Repository<Parking>,
  ) {}

  async getParkings() {
    return this.parkingRepository.find({ 
      where: { state: 1 },
      order: { createAt: 'DESC' },
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

  async getParkingsByDateRange(startDate: string, endDate: string) {
    const startOfDay = dayjs(startDate).startOf('day').toDate();
    const endOfDay = dayjs(endDate).endOf('day').toDate();

    return this.parkingRepository
      .createQueryBuilder('parking')
      .leftJoinAndSelect('parking.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.typeVehicle', 'typeVehicle')
      .leftJoinAndSelect('parking.typeParking', 'typeParking')
      .leftJoinAndSelect('parking.parkingPayments', 'parkingPayments')
      .where('parking.dateInitial >= :startDate', { startDate: startOfDay })
      .andWhere('parking.dateInitial <= :endDate', { endDate: endOfDay })
      .orderBy('parking.createAt', 'DESC')
      .getMany();
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
