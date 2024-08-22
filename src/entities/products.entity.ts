import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Sale } from './sales.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  @OneToMany(() => Sale, (sale) => sale.productId)
  id: number;

  @Column()
  product: string;

  @Column()
  value_buys: number;

  @Column()
  sale_value: number;

  @Column()
  existence: number;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}