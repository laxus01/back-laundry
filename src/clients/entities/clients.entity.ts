import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AccountsReceivable } from 'src/accountsReceivable/entities/accounts-receivable.entity';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  client: string;

  @Column()
  phone: string;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @OneToMany(() => AccountsReceivable, (accountsReceivable) => accountsReceivable.clientId)
  accountsReceivable: AccountsReceivable[];
}
