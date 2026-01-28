import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Washer } from '../../washers/entities/washers.entity';

@Entity({ name: 'advances' })
export class Advance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  washerId: string;

  @ManyToOne(() => Washer)
  @JoinColumn({ name: 'washerId' })
  washer: Washer;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
