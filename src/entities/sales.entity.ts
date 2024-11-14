import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Product } from './products.entity';
import { Attention } from './attentions.entity';

@Entity({ name: 'sales' })
export class Sale {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => Product, (product) => product.sales)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @OneToOne(() => Attention, (attention) => attention.id)
  @JoinColumn({ name: 'attentionId' })
  attention: Attention;
}