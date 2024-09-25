import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './products.entity';

@Entity({ name: 'sales' })
export class Sale {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => Product, (product) => product.sales)
  @JoinColumn({ name: 'productId' })
  product: Product;
}