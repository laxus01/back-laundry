import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity({ name: 'type_vehicles' })
export class TypeVehicle {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  type: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.typeVehicle)
  vehicles: Vehicle[];
}