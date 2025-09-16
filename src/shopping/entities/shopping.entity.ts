import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from 'src/products/entities/products.entity';

@Entity({ name: 'shopping' })
export class Shopping {
  @PrimaryColumn('uuid')
  id: string;

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