import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Sale } from './sales.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product: string;

  @Column()
  valueBuys: number;

  @Column()
  saleValue: number;

  @Column()
  existence: number;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @OneToMany(() => Sale, (sale) => sale.productId)
  sales: Sale[];
}