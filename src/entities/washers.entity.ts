import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Attention } from './attentions.entity';

@Entity({ name: 'washers' })
export class Washer {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  @OneToMany(() => Attention, (attention) => attention.washerId)
  id: number;

  @Column()
  washer: string;

  @Column()
  phone: string;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
