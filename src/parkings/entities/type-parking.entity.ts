import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Parking } from 'src/parkings/entities/parkings.entity';

@Entity({ name: 'type_parking' })
export class TypeParking {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  type: string;

  @OneToMany(() => Parking, (parking) => parking.typeParking)
  parkings: Parking[];
}