import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Parking } from '../parkings/entities/parkings.entity';

@Entity({ name: 'type-parking' })
export class TypeParking {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  type: string;

  @OneToMany(() => Parking, (parking) => parking.typeParking)
  parkings: Parking[];
}