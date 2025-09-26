import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Parking } from './entities/parkings.entity';
import { CreateParkingDto, UpdateParkingDto } from './dto/parking.dto';
import { IParkingsRepository, PARKINGS_REPOSITORY_TOKEN } from './interfaces/parkings-manager.interface';
import * as cron from 'cron';
import * as dayjs from 'dayjs';

@Injectable()
export class ParkingsService {
  private readonly logger = new Logger(ParkingsService.name);

  constructor(
    @Inject(PARKINGS_REPOSITORY_TOKEN)
    private readonly parkingsRepository: IParkingsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getParkings(startDate?: string, endDate?: string): Promise<Parking[]> {
    this.logger.log('Fetching all parkings with optional date filtering');

    try {
      // If date range is provided, use QueryBuilder for date filtering
      if (startDate && endDate) {
        const startOfDay = dayjs(startDate).startOf('day').toDate();
        const endOfDay = dayjs(endDate).endOf('day').toDate();

        return await this.parkingsRepository.findByDateRange(startOfDay, endOfDay);
      }

      // Default behavior when no date range is provided
      return await this.parkingsRepository.findAll();
    } catch (error) {
      this.logger.error('Error fetching parkings', error.stack);
      throw error;
    }
  }

  async getParkingById(id: string): Promise<Parking | null> {
    this.logger.log(`Fetching parking with ID: ${id}`);

    try {
      const parking = await this.parkingsRepository.findById(id);
      if (!parking) {
        throw new NotFoundException(`Parking with ID ${id} not found`);
      }
      return parking;
    } catch (error) {
      this.logger.error(`Error fetching parking with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async findByVehicleId(vehicleId: string): Promise<Parking[]> {
    this.logger.log(`Fetching parkings for vehicle ID: ${vehicleId}`);

    try {
      return await this.parkingsRepository.findByVehicleId(vehicleId);
    } catch (error) {
      this.logger.error(`Error fetching parkings for vehicle ID: ${vehicleId}`, error.stack);
      throw error;
    }
  }

  async createParking(parkingData: CreateParkingDto): Promise<Parking> {
    this.logger.log(`Creating new parking for vehicle: ${parkingData.vehicleId}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        const parking = await this.parkingsRepository.create(parkingData);
        this.logger.log(`Parking created successfully with ID: ${parking.id}`);
        return parking;
      } catch (error) {
        this.logger.error('Error creating parking', error.stack);
        throw error;
      }
    });
  }

  async updateParking(id: string, parkingData: UpdateParkingDto): Promise<Parking> {
    this.logger.log(`Updating parking with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        // Check if parking exists
        await this.getParkingById(id);

        const updatedParking = await this.parkingsRepository.update(id, parkingData);
        this.logger.log(`Parking updated successfully: ${id}`);
        return updatedParking;
      } catch (error) {
        this.logger.error(`Error updating parking with ID: ${id}`, error.stack);
        throw error;
      }
    });
  }

  async deleteParking(id: string): Promise<void> {
    this.logger.log(`Soft deleting parking with ID: ${id}`);

    try {
      await this.parkingsRepository.softDelete(id);
      this.logger.log(`Parking soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error soft deleting parking with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async hardDeleteParking(id: string): Promise<void> {
    this.logger.log(`Hard deleting parking with ID: ${id}`);

    try {
      const result = await this.parkingsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Parking with ID ${id} not found`);
      }
      this.logger.log(`Parking hard deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error hard deleting parking with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async getParkingsByDateRange(startDate: string, endDate: string): Promise<Parking[]> {
    this.logger.log(`Fetching parkings by date range: ${startDate} to ${endDate}`);

    try {
      if (!startDate || !endDate) {
        throw new Error('startDate and endDate are required parameters');
      }

      const startOfDay = dayjs(startDate).startOf('day').toDate();
      const endOfDay = dayjs(endDate).endOf('day').toDate();

      return await this.parkingsRepository.findByDateRange(startOfDay, endOfDay);
    } catch (error) {
      this.logger.error(`Error fetching parkings by date range: ${startDate} to ${endDate}`, error.stack);
      throw error;
    }
  }

  async insertAllParkings(): Promise<void> {
    this.logger.log('Inserting all parkings (monthly cron job)');

    try {
      await this.parkingsRepository.insertAllParkings();
      this.logger.log('All parkings inserted successfully');
    } catch (error) {
      this.logger.error('Error inserting all parkings', error.stack);
      throw error;
    }
  }

  setupMonthlyCron(): void {
    this.logger.log('Setting up monthly cron job for parkings');

    try {
      const CronJob = cron.CronJob;
      const job = new CronJob('0 0 0 1 * *', () => {
        this.insertAllParkings()
      });
      job.start();
      this.logger.log('Monthly cron job started successfully');
    } catch (error) {
      this.logger.error('Error setting up monthly cron job', error.stack);
      throw error;
    }
  }
}
