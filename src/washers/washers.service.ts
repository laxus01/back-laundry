import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Washer } from './entities/washers.entity';
import { CreateWasherDto, UpdateWasherDto } from './dto/washers.dto';
import { IWashersRepository, WASHERS_REPOSITORY_TOKEN } from './interfaces/washers-manager.interface';

@Injectable()
export class WashersService {
  private readonly logger = new Logger(WashersService.name);

  constructor(
    @Inject(WASHERS_REPOSITORY_TOKEN)
    private readonly washersRepository: IWashersRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getWashers(): Promise<Washer[]> {
    this.logger.log('Fetching all active washers');

    try {
      return await this.washersRepository.findAll();
    } catch (error) {
      this.logger.error('Error fetching washers', error.stack);
      throw error;
    }
  }

  async getWasherById(id: string): Promise<Washer | null> {
    this.logger.log(`Fetching washer with ID: ${id}`);

    try {
      const washer = await this.washersRepository.findById(id);
      if (!washer) {
        throw new NotFoundException(`Washer with ID ${id} not found`);
      }
      return washer;
    } catch (error) {
      this.logger.error(`Error fetching washer with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async findByPhone(phone: string): Promise<Washer | null> {
    this.logger.log(`Fetching washer with phone: ${phone}`);

    try {
      return await this.washersRepository.findByPhone(phone);
    } catch (error) {
      this.logger.error(`Error fetching washer with phone: ${phone}`, error.stack);
      throw error;
    }
  }

  async createWasher(washerData: CreateWasherDto): Promise<Washer> {
    this.logger.log(`Creating new washer: ${washerData.washer}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        // Check if phone already exists
        const existingWasher = await this.washersRepository.findByPhone(washerData.phone);
        if (existingWasher) {
          throw new Error('El teléfono ya existe en la base de datos');
        }

        const washer = await this.washersRepository.create(washerData);
        this.logger.log(`Washer created successfully with ID: ${washer.id}`);
        return washer;
      } catch (error) {
        this.logger.error('Error creating washer', error.stack);
        throw error;
      }
    });
  }

  async updateWasher(id: string, washerData: UpdateWasherDto): Promise<Washer> {
    this.logger.log(`Updating washer with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      try {
        // Check if washer exists
        await this.getWasherById(id);

        const updatedWasher = await this.washersRepository.update(id, washerData);
        this.logger.log(`Washer updated successfully: ${id}`);
        return updatedWasher;
      } catch (error) {
        this.logger.error(`Error updating washer with ID: ${id}`, error.stack);
        throw error;
      }
    });
  }

  async deleteWasher(id: string): Promise<void> {
    this.logger.log(`Soft deleting washer with ID: ${id}`);

    try {
      await this.washersRepository.softDelete(id);
      this.logger.log(`Washer soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error soft deleting washer with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async hardDeleteWasher(id: string): Promise<void> {
    this.logger.log(`Hard deleting washer with ID: ${id}`);

    try {
      const result = await this.washersRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Washer with ID ${id} not found`);
      }
      this.logger.log(`Washer hard deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Error hard deleting washer with ID: ${id}`, error.stack);
      throw error;
    }
  }
}