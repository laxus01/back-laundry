import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity({name: 'type-vehicles'})
export class TypeVehicle {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Vehicle, (vehicle) => vehicle.typeVehicleId)
  id: number;

  @Column()
  type: string;
  
}