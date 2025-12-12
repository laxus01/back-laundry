import { Injectable, Logger, Inject, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { IUsersRepository, USERS_REPOSITORY_TOKEN } from './interfaces/users-manager.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: IUsersRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getUsers(): Promise<User[]> {
    this.logger.log('Fetching all users');

    try {
      return await this.usersRepository.findAll();
    } catch (error) {
      this.logger.error('Error fetching users', error.stack);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    this.logger.log(`Fetching user with ID: ${id}`);

    try {
      const user = await this.usersRepository.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    this.logger.log(`Fetching user with username: ${username}`);

    try {
      return await this.usersRepository.findByUsername(username);
    } catch (error) {
      this.logger.error(`Error fetching user with username: ${username}`, error.stack);
      throw error;
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    this.logger.log(`Creating new user: ${userData.user}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        if (!userData?.user || !userData?.password) {
          throw new BadRequestException('user y password son requeridos');
        }

        // Check if username already exists
        const existingUser = await this.usersRepository.findByUsername(userData.user);
        if (existingUser) {
          throw new ConflictException('El nombre de usuario ya existe en la base de datos');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const user = await this.usersRepository.create({
          ...userData,
          password: hashedPassword,
        });

        this.logger.log(`User created successfully with ID: ${user.id}`);
        return user;
      } catch (error) {
        this.logger.error('Error creating user', error.stack);
        throw error;
      }
    });
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        // Check if user exists
        await this.getUserById(id);

        // Hash password if it's being updated
        let updatedData = { ...userData };
        if (userData.password) {
          updatedData.password = await bcrypt.hash(userData.password, 12);
        }

        const updatedUser = await this.usersRepository.update(id, updatedData);
        this.logger.log(`User updated successfully: ${id}`);
        return updatedUser;
      } catch (error) {
        this.logger.error(`Error updating user with ID: ${id}`, error.stack);
        throw error;
      }
    });
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.log(`Soft deleting user with ID: ${id}`);

    try {
      await this.usersRepository.softDelete(id);
      this.logger.log(`User soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error soft deleting user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async hardDeleteUser(id: string): Promise<void> {
    this.logger.log(`Hard deleting user with ID: ${id}`);

    try {
      const result = await this.usersRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logger.log(`User hard deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error hard deleting user with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async validateUserCredentials(username: string, password: string): Promise<User | null> {
    this.logger.log(`Validating credentials for user: ${username}`);

    try {
      const user = await this.usersRepository.findByUsername(username);

      if (!user) {
        this.logger.warn(`User not found: ${username}`);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${username}`);
        return null;
      }

      this.logger.log(`Valid credentials for user: ${username}`);
      return user;
    } catch (error) {
      this.logger.error(`Error validating credentials for user: ${username}`, error.stack);
      throw error;
    }
  }
}
