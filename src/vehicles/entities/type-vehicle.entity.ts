import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity({ name: 'type-vehicles' })
export class TypeVehicle {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  type: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.typeVehicle)
  vehicles: Vehicle[];
}