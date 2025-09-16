import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'expenses' })
export class Expense {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  expense: string;

  @Column()
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}