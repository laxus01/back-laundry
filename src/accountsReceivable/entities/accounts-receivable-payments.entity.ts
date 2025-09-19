import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AccountsReceivable } from './accounts-receivable.entity';

@Entity({ name: 'accounts_receivable_payments' })
export class AccountsReceivablePayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  value: number;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column('uuid')
  accountsReceivableId: string;

  @ManyToOne(() => AccountsReceivable, (accountsReceivable) => accountsReceivable.accountsReceivablePayments)
  @JoinColumn({ name: 'accountsReceivableId' })
  accountsReceivable: AccountsReceivable;
}
