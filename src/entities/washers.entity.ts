import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Attention } from './attentions.entity';

@Entity({ name: 'washers' })
export class Washer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  washer: string;

  @Column()
  phone: string;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @OneToMany(() => Attention, (attention) => attention.washerId)
  attentions: Attention[];
}