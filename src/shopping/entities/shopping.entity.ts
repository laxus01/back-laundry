import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/products.entity';

@Entity({ name: 'shopping' })
export class Shopping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column({ type: 'int', default: 0 })
  unitPrice: number;

  @Column('uuid')
  productId: string;

  @ManyToOne(() => Product, (product) => product.shoppings)
  @JoinColumn({ name: 'productId' })
  product: Product;
}