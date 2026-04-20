import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ParkingPayment } from './entities/parking-payments.entity';
import { Parking } from './entities/parkings.entity';
import { CreateParkingPaymentDto, UpdateParkingPaymentDto } from './dto/parking-payment.dto';
import { IParkingsRepository, PARKINGS_REPOSITORY_TOKEN } from './interfaces/parkings-manager.interface';

@Injectable()
export class ParkingPaymentsService {
  private readonly logger = new Logger(ParkingPaymentsService.name);

  constructor(
    @Inject(PARKINGS_REPOSITORY_TOKEN)
    private readonly parkingsRepository: IParkingsRepository,
    private readonly dataSource: DataSource,
  ) {}

  private async updateParkingState(parkingId: string, manager?: any): Promise<void> {
    this.logger.log(`Updating parking state for parking ID: ${parkingId}`);

    try {
      const parkingRepo = manager ? manager.getRepository(Parking) : this.dataSource.getRepository(Parking);
      const paymentRepo = manager ? manager.getRepository(ParkingPayment) : this.dataSource.getRepository(ParkingPayment);

      // Get the parking record
      const parking = await parkingRepo.findOne({
        where: { id: parkingId },
      });

      if (!parking) {
        throw new NotFoundException(`Parking with ID ${parkingId} not found`);
      }

      // Calculate total payments for this parking
      const payments = await paymentRepo.find({
        where: { parkingId },
      });

      const totalPaid = payments.reduce((sum, payment) => sum + payment.value, 0);

      this.logger.log(`Parking ID: ${parkingId} - Value: ${parking.value}, Total Paid: ${totalPaid}, Current paymentStatus: ${parking.paymentStatus}`);

      // Update paymentStatus based on payment comparison
      // paymentStatus = 0 if fully paid (totalPaid >= parking.value)
      // paymentStatus = 1 if not fully paid (totalPaid < parking.value)
      const newPaymentStatus = totalPaid >= parking.value ? 0 : 1;

      this.logger.log(`Calculated new paymentStatus: ${newPaymentStatus} (totalPaid >= value: ${totalPaid >= parking.value})`);

      if (parking.paymentStatus !== newPaymentStatus) {
        parking.paymentStatus = newPaymentStatus;
        await parkingRepo.save(parking);
        this.logger.log(`Parking paymentStatus updated from ${parking.paymentStatus} to ${newPaymentStatus} for parking ID: ${parkingId}`);
      } else {
        this.logger.log(`Parking paymentStatus unchanged (already ${parking.paymentStatus}) for parking ID: ${parkingId}`);
      }
    } catch (error) {
      this.logger.error(`Error updating parking state for parking ID: ${parkingId}`, error.stack);
      throw error;
    }
  }

  async createParkingPayment(createParkingPaymentDto: CreateParkingPaymentDto): Promise<ParkingPayment> {
    this.logger.log(`Creating new parking payment for parking ID: ${createParkingPaymentDto.parkingId}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        const parkingPayment = manager.getRepository(ParkingPayment).create(createParkingPaymentDto);
        const savedPayment = await manager.getRepository(ParkingPayment).save(parkingPayment);

        // Update parking state after creating payment
        await this.updateParkingState(createParkingPaymentDto.parkingId, manager);

        this.logger.log(`Parking payment created successfully with ID: ${savedPayment.id}`);
        return savedPayment;
      } catch (error) {
        this.logger.error('Error creating parking payment', error.stack);
        throw error;
      }
    });
  }

  async updateParkingPayment(id: string, updateParkingPaymentDto: UpdateParkingPaymentDto): Promise<ParkingPayment> {
    this.logger.log(`Updating parking payment with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        const existingPayment = await manager.getRepository(ParkingPayment).findOne({
          where: { id },
        });

        if (!existingPayment) {
          throw new NotFoundException(`Parking payment with ID ${id} not found`);
        }

        const updateData: any = { ...updateParkingPaymentDto };

        if (updateParkingPaymentDto.parkingId) {
          updateData.parking = { id: updateParkingPaymentDto.parkingId };
          delete updateData.parkingId;
        }

        const updatedPayment = { ...existingPayment, ...updateData };
        const savedPayment = await manager.getRepository(ParkingPayment).save(updatedPayment);

        // Update parking state after updating payment
        // Use the parkingId from the update data or existing payment
        const parkingId = updateParkingPaymentDto.parkingId || existingPayment.parkingId;
        await this.updateParkingState(parkingId, manager);

        this.logger.log(`Parking payment updated successfully: ${id}`);
        return savedPayment;
      } catch (error) {
        this.logger.error(`Error updating parking payment with ID: ${id}`, error.stack);
        throw error;
      }
    });
  }

  async getParkingPayments(): Promise<any[]> {
    this.logger.log('Fetching all parking payments with saldo calculation');

    try {
      const payments = await this.dataSource.getRepository(ParkingPayment).find({
        relations: ['parking'],
      });

      // Group payments by parking to calculate saldo for each parking
      const paymentsByParking = new Map<string, ParkingPayment[]>();

      payments.forEach(payment => {
        const parkingId = payment.parkingId;
        if (!paymentsByParking.has(parkingId)) {
          paymentsByParking.set(parkingId, []);
        }
        paymentsByParking.get(parkingId)!.push(payment);
      });

      // Calculate saldo for each payment and add it to the response
      const result = payments.map(payment => {
        const parkingPayments = paymentsByParking.get(payment.parkingId) || [];
        const totalPaid = parkingPayments.reduce((sum, p) => sum + p.value, 0);
        const saldo = payment.parking.value - totalPaid;

        return {
          ...payment,
          saldo
        };
      });

      this.logger.log(`Retrieved ${result.length} parking payments with saldo calculation`);
      return result;
    } catch (error) {
      this.logger.error('Error fetching parking payments', error.stack);
      throw error;
    }
  }

  async getParkingPaymentById(id: string): Promise<ParkingPayment> {
    this.logger.log(`Fetching parking payment with ID: ${id}`);

    try {
      const payment = await this.dataSource.getRepository(ParkingPayment).findOne({
        where: { id },
        relations: ['parking'],
      });

      if (!payment) {
        throw new NotFoundException(`Parking payment with ID ${id} not found`);
      }

      this.logger.log(`Parking payment retrieved successfully: ${id}`);
      return payment;
    } catch (error) {
      this.logger.error(`Error fetching parking payment with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async deleteParkingPayment(id: string): Promise<void> {
    this.logger.log(`Deleting parking payment with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        const payment = await manager.getRepository(ParkingPayment).findOne({
          where: { id },
        });

        if (!payment) {
          throw new NotFoundException(`Parking payment with ID ${id} not found`);
        }

        const parkingId = payment.parkingId;
        await manager.getRepository(ParkingPayment).remove(payment);

        // Update parking state after deleting payment
        await this.updateParkingState(parkingId, manager);

        this.logger.log(`Parking payment deleted successfully: ${id}`);
      } catch (error) {
        this.logger.error(`Error deleting parking payment with ID: ${id}`, error.stack);
        throw error;
      }
    });
  }

  async getParkingPaymentsByParkingId(parkingId: string): Promise<any[]> {
    this.logger.log(`Fetching parking payments for parking ID: ${parkingId}`);

    try {
      const payments = await this.dataSource.getRepository(ParkingPayment).find({
        where: { parkingId },
        relations: ['parking'],
      });

      // Calculate saldo for each payment
      const result = payments.map(payment => {
        const totalPaid = payments.reduce((sum, p) => sum + p.value, 0);
        const saldo = payment.parking.value - totalPaid;

        return {
          ...payment,
          saldo
        };
      });

      this.logger.log(`Retrieved ${result.length} parking payments for parking ID: ${parkingId}`);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching parking payments for parking ID: ${parkingId}`, error.stack);
      throw error;
    }
  }
}
