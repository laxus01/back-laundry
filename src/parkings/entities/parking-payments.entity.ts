import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Parking } from './parkings.entity';

@Entity({ name: 'parking_payments' })
export class ParkingPayment {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  value: number;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => Parking, (parking) => parking.parkingPayments)
  @JoinColumn({ name: 'parkingId' })
  parking: Parking;
}
