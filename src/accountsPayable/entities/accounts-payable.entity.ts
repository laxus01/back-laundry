import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Provider } from 'src/provider/entities/provider.entity';

@Entity({ name: 'accounts_payable' })
export class AccountsPayable {
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

  @ManyToOne(() => Provider, (provider) => provider.accountsPayable, { nullable: false })
  @JoinColumn({ name: 'providerId' })
  providerId: Provider;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
