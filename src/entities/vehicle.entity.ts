import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { TypeVehicle } from './type-vehicle.entity';

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ unique: true })
  plate: string;

  @Column()
  client: string;

  @Column()
  phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => TypeVehicle, (typeVehicle) => typeVehicle.id)
  @JoinColumn({ name: 'typeVehicleId' })
  typeVehicleId: TypeVehicle;
}
