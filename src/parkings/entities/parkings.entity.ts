import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { TypeParking } from '../entities/type-parking.entity';
import { ParkingPayment } from './parking-payments.entity';

@Entity({ name: 'parkings' })
export class Parking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  dateInitial: Date;

  @Column({ type: 'date' })
  dateFinal: Date;

  @Column()
  value: number;

  @Column({ default: 1 })
  paymentStatus: number;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column('uuid')
  typeParkingId: string;

  @Column('uuid')
  vehicleId: string;

  @ManyToOne(() => TypeParking, (typeParking) => typeParking.parkings)
  @JoinColumn({ name: 'typeParkingId' })
  typeParking: TypeParking;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.parkings)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @OneToMany(() => ParkingPayment, (parkingPayment) => parkingPayment.parking)
  parkingPayments: ParkingPayment[];
}