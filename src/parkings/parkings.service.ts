import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Parking } from './entities/parkings.entity';
import { CreateParkingDto, UpdateParkingDto } from './dto/parking.dto';
import { IParkingsRepository, PARKINGS_REPOSITORY_TOKEN } from './interfaces/parkings-manager.interface';
import * as cron from 'cron';
import * as dayjs from 'dayjs';

export interface SearchParkingsParams {
  page: number;
  limit: number;
  paymentStatus?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  vehicleId?: string;
  state?: number;
  dateInitialFrom?: string;
  dateInitialTo?: string;
  dateFinalFrom?: string;
  dateFinalTo?: string;
  creationDateFrom?: string;
  creationDateTo?: string;
}

export interface PaginatedParkingsResponse {
  items: Parking[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

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

      const parkings = await this.parkingsRepository.findByDateRange(startOfDay, endOfDay);

      // Calculate and update payment status based on actual balance
      parkings.forEach(parking => {
        const totalPaid = parking.parkingPayments.reduce((sum, payment) => sum + payment.value, 0);
        const balance = parking.value - totalPaid;
        
        // Update paymentStatus: 0 = Paid, 1 = Pending
        parking.paymentStatus = balance <= 0 ? 0 : 1;
      });

      return parkings;
    } catch (error) {
      this.logger.error(`Error fetching parkings by date range: ${startDate} to ${endDate}`, error.stack);
      throw error;
    }
  }
  
  async searchParkings(params: SearchParkingsParams): Promise<PaginatedParkingsResponse> {
    this.logger.log('Searching parkings with filters and pagination');

    try {
      const {
        page,
        limit,
        paymentStatus,
        startDate,
        endDate,
        sortBy,
        sortDirection,
        vehicleId,
        state,
        dateInitialFrom,
        dateInitialTo,
        dateFinalFrom,
        dateFinalTo,
        creationDateFrom,
        creationDateTo,
      } = params;

      const repository = this.dataSource.getRepository(Parking);
      const query = repository
        .createQueryBuilder('parking')
        .leftJoinAndSelect('parking.vehicle', 'vehicle')
        .leftJoinAndSelect('vehicle.typeVehicle', 'typeVehicle')
        .leftJoinAndSelect('parking.typeParking', 'typeParking')
        .leftJoinAndSelect('parking.parkingPayments', 'parkingPayments');

      // Filter by paymentStatus if provided
      if (typeof paymentStatus === 'number') {
        query.andWhere('parking.paymentStatus = :paymentStatus', { paymentStatus });
      }

      // Filter by state if provided (for soft delete or other state management)
      if (typeof state === 'number') {
        query.andWhere('parking.state = :state', { state });
      }

      if (vehicleId) {
        query.andWhere('parking.vehicleId = :vehicleId', { vehicleId });
      }

      if (startDate && endDate) {
        query.andWhere('parking.dateInitial BETWEEN :startDate AND :endDate', { startDate, endDate });
      }

      if (dateInitialFrom) {
        query.andWhere('parking.dateInitial >= :dateInitialFrom', { dateInitialFrom });
      }

      if (dateInitialTo) {
        query.andWhere('parking.dateInitial <= :dateInitialTo', { dateInitialTo });
      }

      if (dateFinalFrom) {
        query.andWhere('parking.dateFinal >= :dateFinalFrom', { dateFinalFrom });
      }

      if (dateFinalTo) {
        query.andWhere('parking.dateFinal <= :dateFinalTo', { dateFinalTo });
      }

      if (creationDateFrom) {
        query.andWhere('parking.createAt >= :creationDateFrom', { creationDateFrom });
      }

      if (creationDateTo) {
        query.andWhere('parking.createAt <= :creationDateTo', { creationDateTo });
      }

      const allowedSortBy = new Set(['createAt', 'paymentStatus', 'dateInitial', 'dateFinal', 'value']);
      const sortColumn = sortBy && allowedSortBy.has(sortBy) ? sortBy : 'createAt';
      const direction: 'ASC' | 'DESC' = sortDirection === 'ASC' ? 'ASC' : 'DESC';

      query.orderBy(`parking.${sortColumn}`, direction);

      const pageNumber = page && page > 0 ? page : 1;
      const pageSize = limit && limit > 0 ? limit : 10;
      const skip = (pageNumber - 1) * pageSize;

      query.skip(skip);
      query.take(pageSize);

      const [items, totalItems] = await query.getManyAndCount();

      const itemCount = items.length;
      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        items,
        meta: {
          totalItems,
          itemCount,
          itemsPerPage: pageSize,
          totalPages,
          currentPage: pageNumber,
        },
      };
    } catch (error) {
      this.logger.error('Error searching parkings', error.stack);
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
