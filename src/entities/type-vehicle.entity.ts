import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'type-vehicles'})
export class TypeVehicle {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;
}