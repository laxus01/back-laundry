import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { TypeVehicle } from './type-vehicle.entity';

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  plate: string;

  @Column()
  client: string;

  @Column()
  phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @OneToOne(() => TypeVehicle)
  @JoinColumn()
  typeVehicle: TypeVehicle;
}
