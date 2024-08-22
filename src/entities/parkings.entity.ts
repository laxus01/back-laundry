import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

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
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  @JoinColumn({ name: 'vehicleId' })
  vehicleId: Vehicle;
}
