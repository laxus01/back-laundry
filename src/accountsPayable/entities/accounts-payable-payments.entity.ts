import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AccountsPayable } from './accounts-payable.entity';

@Entity({ name: 'accounts_payable_payments' })
export class AccountsPayablePayment {
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
  accountsPayableId: string;

  @ManyToOne(() => AccountsPayable, (accountsPayable) => accountsPayable.accountsPayablePayments)
  @JoinColumn({ name: 'accountsPayableId' })
  accountsPayable: AccountsPayable;
}
