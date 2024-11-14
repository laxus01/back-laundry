import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Washer } from './washers.entity';

@Entity({ name: 'attentions' })
export class Attention {

  @PrimaryColumn('uuid')
  id: string;

  @Column()
  percentage: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.attentions)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @ManyToOne(() => Washer, (washer) => washer.attentions)
  @JoinColumn({ name: 'washerId' })
  washer: Washer;
}