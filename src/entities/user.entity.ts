import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  user: string;

  @Column()
  password: string;

  @Column()
  permissions: string;

  @Column()
  name: string;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createAt: Date;
}