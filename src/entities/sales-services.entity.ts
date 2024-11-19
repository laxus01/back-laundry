import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Attention } from './attentions.entity';
import { Service } from './services.entity';

@Entity({ name: 'sales-services' })
export class SaleService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column()
  value: number;

  @ManyToOne(() => Service, (service) => service.id)
  @JoinColumn({ name: 'serviceId' })
  serviceId: Service;

  @ManyToOne(() => Attention, (attention) => attention.id)
  @JoinColumn({ name: 'attentionId' })
  attentionId: Attention;
}