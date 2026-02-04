import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Washer } from '../../washers/entities/washers.entity';
import { SaleService } from '../../sales/entities/sales-services.entity';

@Entity({ name: 'attentions' })
export class Attention {

  @PrimaryColumn('uuid')
  id: string;

  @OneToMany(() => SaleService, (saleService) => saleService.attentionId)
  saleServices: SaleService[];

  @Column()
  percentage: number;

  @Column({ 
    type: 'enum', 
    enum: ['PAID', 'PENDING', 'PARTIAL'],
    default: 'PAID',
    nullable: true
  })
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';

  @Column({ type: 'timestamp', nullable: true })
  paymentDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishDate: Date;

  @Column({ type: 'int', default: 0, nullable: true })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.attentions)
  @JoinColumn({ name: 'vehicleId' })
  vehicleId: Vehicle;

  @ManyToOne(() => Washer, (washer) => washer.attentions)
  @JoinColumn({ name: 'washerId' })
  washerId: Washer;

}