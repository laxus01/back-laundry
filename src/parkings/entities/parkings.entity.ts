import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { TypeParking } from '../entities/type-parking.entity';

@Entity({ name: 'parkings' })
export class Parking {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  dateInitial: Date;

  @Column()
  dateFinal: Date;

  @Column()
  value: number;

  @Column({ default: 1 })
  paymentStatus: number;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => TypeParking, (typeParking) => typeParking.parkings)
  @JoinColumn({ name: 'typeParkingId' })
  typeParking: TypeParking;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.parkings)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;
}