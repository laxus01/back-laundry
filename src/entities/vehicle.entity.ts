import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TypeVehicle } from './type-vehicle.entity';
import { Attention } from './attentions.entity';
import { Parking } from './parkings.entity';

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

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => TypeVehicle, (typeVehicle) => typeVehicle.vehicles)
  @JoinColumn({ name: 'typeVehicleId' })
  typeVehicle: TypeVehicle;

  @OneToMany(() => Attention, (attention) => attention.vehicle)
  attentions: Attention[];

  @OneToMany(() => Parking, (parking) => parking.vehicle)
  parkings: Parking[];
}