import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Between } from 'typeorm';
import { Parking } from '../entities/parkings.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { TypeParking } from '../entities/type-parking.entity';
import { ParkingPayment } from '../entities/parking-payments.entity';
import { CreateParkingDto, UpdateParkingDto } from '../dto/parking.dto';
import { IParkingsRepository, PARKINGS_REPOSITORY_TOKEN } from '../interfaces/parkings-manager.interface';

@Injectable()
export class ParkingsRepository implements IParkingsRepository {
  constructor(
    @InjectRepository(Parking)
    private readonly parkingsRepository: Repository<Parking>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(TypeParking)
    private readonly typeParkingRepository: Repository<TypeParking>,
    @InjectRepository(ParkingPayment)
    private readonly parkingPaymentRepository: Repository<ParkingPayment>,
  ) {}

  async findAll(): Promise<Parking[]> {
    return this.parkingsRepository.find({
      where: { state: 1 },
      order: { createAt: 'DESC' },
      relations: ['vehicle', 'vehicle.typeVehicle', 'typeParking', 'parkingPayments'],
    });
  }

  async findById(id: string): Promise<Parking | null> {
    const parking = await this.parkingsRepository.findOne({
      where: { id: String(id) },
      relations: ['vehicle', 'vehicle.typeVehicle', 'typeParking', 'parkingPayments'],
    });

    return parking || null;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Parking[]> {
    return this.parkingsRepository
      .createQueryBuilder('parking')
      .leftJoinAndSelect('parking.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.typeVehicle', 'typeVehicle')
      .leftJoinAndSelect('parking.typeParking', 'typeParking')
      .leftJoinAndSelect('parking.parkingPayments', 'parkingPayments')
      .where('parking.dateInitial >= :startDate', { startDate })
      .andWhere('parking.dateInitial <= :endDate', { endDate })
      .orderBy('parking.createAt', 'DESC')
      .getMany();
  }

  async create(createParkingDto: CreateParkingDto): Promise<Parking> {
    const newParking = this.parkingsRepository.create(createParkingDto);

    return this.parkingsRepository.save(newParking);
  }

  async update(id: string, updateParkingDto: UpdateParkingDto): Promise<Parking> {
    const existingParking = await this.findById(id);

    if (!existingParking) {
      throw new NotFoundException(`Parking with ID ${id} not found`);
    }

    // Merge the existing parking with the update data
    const updatedParking = this.parkingsRepository.merge(existingParking, updateParkingDto);

    return this.parkingsRepository.save(updatedParking);
  }

  async delete(id: string): Promise<DeleteResult> {
    const existingParking = await this.findById(id);

    if (!existingParking) {
      throw new NotFoundException(`Parking with ID ${id} not found`);
    }

    return this.parkingsRepository.delete(id);
  }

  async softDelete(id: string): Promise<Parking> {
    const existingParking = await this.findById(id);

    if (!existingParking) {
      throw new NotFoundException(`Parking with ID ${id} not found`);
    }

    // Soft delete by setting state to 0
    existingParking.state = 0;
    return this.parkingsRepository.save(existingParking);
  }

  async findByVehicleId(vehicleId: string): Promise<Parking[]> {
    return this.parkingsRepository.find({
      where: { vehicleId, state: 1 },
      relations: ['vehicle', 'vehicle.typeVehicle', 'typeParking', 'parkingPayments'],
      order: { createAt: 'DESC' },
    });
  }

  async insertAllParkings(): Promise<void> {
    const query = `
      INSERT INTO parkings (dateInitial, dateFinal, value, typeParkingId, vehicleId, paymentStatus)
      SELECT  DATE_ADD(MAX(dateInitial), INTERVAL +1 MONTH), DATE_ADD(MAX(dateFinal), INTERVAL +1 MONTH), value, typeParkingId, vehicleId, paymentStatus
      FROM parkings
      WHERE typeParkingId = 2 AND state = 1
      GROUP BY vehicleId;
    `;

    await this.parkingsRepository.query(query);
  }
}
