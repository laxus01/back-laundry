import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Parking } from './parkings.entity';

@Entity({name: 'type-parking'})
export class TypeParking {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Parking, (parking) => parking.typeParkingId)
  id: number;

  @Column()
  type: string;
  
}