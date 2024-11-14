import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  service: string;

  @Column()
  value: number;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}