import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  client: string;

  @Column()
  phone: string;

  @Column({ default: 1 })
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
