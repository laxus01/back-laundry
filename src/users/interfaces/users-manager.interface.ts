import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { DeleteResult } from 'typeorm';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(user: CreateUserDto): Promise<User>;
  update(id: string, user: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<DeleteResult>;
  softDelete(id: string): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
}

export const USERS_REPOSITORY_TOKEN = 'USERS_REPOSITORY';