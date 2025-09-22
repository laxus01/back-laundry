import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
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

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.accountsReceivable, { nullable: false })
  @JoinColumn({ name: 'vehicleId' })
  vehicleId: Vehicle;

  @OneToMany(() => AccountsReceivablePayment, (payment) => payment.accountsReceivable)
  accountsReceivablePayments: AccountsReceivablePayment[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
