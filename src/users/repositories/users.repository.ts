import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { IUsersRepository, USERS_REPOSITORY_TOKEN } from '../interfaces/users-manager.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id: String(id) },
    });

    return user || null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Merge the existing user with the update data
    const updatedUser = this.usersRepository.merge(existingUser, updateUserDto);

    return this.usersRepository.save(updatedUser);
  }

  async delete(id: string): Promise<DeleteResult> {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.usersRepository.delete(id);
  }

  async softDelete(id: string): Promise<User> {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // For users, we'll use a soft delete approach by setting a deleted flag
    // Since there's no state field in the entity, we'll just delete the user
    // This could be enhanced later if needed
    const deletedUser = this.usersRepository.merge(existingUser, { user: `DELETED_${existingUser.user}_${Date.now()}` });
    return this.usersRepository.save(deletedUser);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { user: username },
    });

    return user || null;
  }
}