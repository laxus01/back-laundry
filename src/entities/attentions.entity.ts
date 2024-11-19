import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Washer } from './washers.entity';
import { SaleService } from './sales-services.entity';

@Entity({ name: 'attentions' })
export class Attention {

  @PrimaryColumn('uuid')
  id: string;

  @OneToMany(() => SaleService, (saleService) => saleService.attentionId)
  saleServices: SaleService[];

  @Column()
  percentage: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.attentions)
  @JoinColumn({ name: 'vehicleId' })
  vehicleId: Vehicle;

  @ManyToOne(() => Washer, (washer) => washer.attentions)
  @JoinColumn({ name: 'washerId' })
  washerId: Washer;

}