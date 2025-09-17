import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Product } from '../../products/entities/products.entity';
import { Attention } from '../../attentions/entities/attentions.entity';
import { Washer } from '../../washers/entities/washers.entity';

@Entity({ name: 'sales' })
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'productId' })
  productId: Product;

  @ManyToOne(() => Attention, (attention) => attention.id)
  @JoinColumn({ name: 'attentionId' })
  attentionId: Attention | null;

  @ManyToOne(() => Washer, (washer) => washer.id, { nullable: true })
  @JoinColumn({ name: 'washerId' })
  washerId: Washer | null;
}