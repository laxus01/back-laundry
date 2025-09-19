import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Client } from 'src/clients/entities/clients.entity';
import { AccountsReceivablePayment } from './accounts-receivable-payments.entity';

@Entity({ name: 'accounts_receivable' })
export class AccountsReceivable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ default: 1 })
  state: number;

  @ManyToOne(() => Client, (client) => client.accountsReceivable, { nullable: false })
  @JoinColumn({ name: 'clientId' })
  clientId: Client;

  @OneToMany(() => AccountsReceivablePayment, (payment) => payment.accountsReceivable)
  accountsReceivablePayments: AccountsReceivablePayment[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
