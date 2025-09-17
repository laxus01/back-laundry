import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'expenses' })
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expense: string;

  @Column()
  value: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}