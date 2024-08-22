import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'our-services' })
export class OurService {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  service: string;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}