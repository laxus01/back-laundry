import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Washer } from './washers.entity';


@Entity({ name: 'attentions' })
export class Attention {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  percentage: number;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  @JoinColumn({ name: 'vehicleId' })
  vehicleId: Vehicle;

  @ManyToOne(() => Washer, (washer) => washer.id)
  @JoinColumn({ name: 'washerId' })
  washerId: Washer;
}