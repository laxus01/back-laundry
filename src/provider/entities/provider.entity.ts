import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AccountsPayable } from 'src/accountsPayable/entities/accounts-payable.entity';

@Entity({ name: 'providers' })
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @OneToMany(() => AccountsPayable, (accountsPayable) => accountsPayable.providerId)
  accountsPayable: AccountsPayable[];
}
