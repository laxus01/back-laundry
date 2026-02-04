import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Washer } from '../../washers/entities/washers.entity';

@Entity({ name: 'defaulter_washers' })
export class DefaulterWasher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column('uuid')
  washerId: string;

  @ManyToOne(() => Washer, (washer) => washer.defaulterWashers)
  @JoinColumn({ name: 'washerId' })
  washer: Washer;
}
