import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingPayment } from './entities/parking-payments.entity';
import { Parking } from './entities/parkings.entity';
import { CreateParkingPaymentDto, UpdateParkingPaymentDto } from './dto/parking-payment.dto';

@Injectable()
export class ParkingPaymentsService {
  constructor(
    @InjectRepository(ParkingPayment)
    private parkingPaymentRepository: Repository<ParkingPayment>,
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,
  ) {}

  private async updateParkingState(parkingId: string): Promise<void> {
    // Get the parking record
    const parking = await this.parkingRepository.findOne({
      where: { id: parkingId },
    });

    if (!parking) {
      throw new NotFoundException(`Parking with ID ${parkingId} not found`);
    }

    // Calculate total payments for this parking
    const payments = await this.parkingPaymentRepository.find({
      where: { parkingId },
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.value, 0);

    // Update state based on payment comparison
    // state = 0 if fully paid (totalPaid >= parking.value)
    // state = 1 if not fully paid (totalPaid < parking.value)
    const newState = totalPaid >= parking.value ? 0 : 1;

    if (parking.state !== newState) {
      await this.parkingRepository.update(parkingId, { state: newState });
    }
  }

  async createParkingPayment(createParkingPaymentDto: CreateParkingPaymentDto): Promise<ParkingPayment> {
    const parkingPayment = this.parkingPaymentRepository.create(createParkingPaymentDto);
    const savedPayment = await this.parkingPaymentRepository.save(parkingPayment);
    
    // Update parking state after creating payment
    await this.updateParkingState(createParkingPaymentDto.parkingId);
    
    return savedPayment;
  }

  async updateParkingPayment(id: string, updateParkingPaymentDto: UpdateParkingPaymentDto): Promise<ParkingPayment> {
    const existingPayment = await this.parkingPaymentRepository.findOne({
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
    const savedPayment = await this.parkingPaymentRepository.save(updatedPayment);
    
    // Update parking state after updating payment
    // Use the parkingId from the update data or existing payment
    const parkingId = updateParkingPaymentDto.parkingId || existingPayment.parkingId;
    await this.updateParkingState(parkingId);
    
    return savedPayment;
  }

  async getParkingPayments(): Promise<any[]> {
    const payments = await this.parkingPaymentRepository.find({
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
    return payments.map(payment => {
      const parkingPayments = paymentsByParking.get(payment.parkingId) || [];
      const totalPaid = parkingPayments.reduce((sum, p) => sum + p.value, 0);
      const saldo = payment.parking.value - totalPaid;

      return {
        ...payment,
        saldo
      };
    });
  }

  async getParkingPaymentById(id: string): Promise<ParkingPayment> {
    const payment = await this.parkingPaymentRepository.findOne({
      where: { id },
      relations: ['parking'],
    });

    if (!payment) {
      throw new NotFoundException(`Parking payment with ID ${id} not found`);
    }

    return payment;
  }

  async deleteParkingPayment(id: string): Promise<void> {
    const payment = await this.parkingPaymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Parking payment with ID ${id} not found`);
    }

    const parkingId = payment.parkingId;
    await this.parkingPaymentRepository.remove(payment);
    
    // Update parking state after deleting payment
    await this.updateParkingState(parkingId);
  }
}
