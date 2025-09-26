import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Washer } from '../entities/washers.entity';
import { CreateWasherDto, UpdateWasherDto } from '../dto/washers.dto';
import { IWashersRepository, WASHERS_REPOSITORY_TOKEN } from '../interfaces/washers-manager.interface';

@Injectable()
export class WashersRepository implements IWashersRepository {
  constructor(
    @InjectRepository(Washer)
    private readonly washerRepository: Repository<Washer>,
  ) {}

  async findAll(): Promise<Washer[]> {
    return this.washerRepository.find({
      where: { state: 1 },
      order: { createAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Washer | null> {
    const washer = await this.washerRepository.findOne({
      where: { id: String(id) },
    });

    return washer || null;
  }

  async create(createWasherDto: CreateWasherDto): Promise<Washer> {
    const newWasher = this.washerRepository.create(createWasherDto);

    return this.washerRepository.save(newWasher);
  }

  async update(id: string, updateWasherDto: UpdateWasherDto): Promise<Washer> {
    const existingWasher = await this.findById(id);

    if (!existingWasher) {
      throw new NotFoundException(`Washer with ID ${id} not found`);
    }

    // Merge the existing washer with the update data
    const updatedWasher = this.washerRepository.merge(existingWasher, updateWasherDto);

    return this.washerRepository.save(updatedWasher);
  }

  async delete(id: string): Promise<DeleteResult> {
    const existingWasher = await this.findById(id);

    if (!existingWasher) {
      throw new NotFoundException(`Washer with ID ${id} not found`);
    }

    return this.washerRepository.delete(id);
  }

  async softDelete(id: string): Promise<Washer> {
    const existingWasher = await this.findById(id);

    if (!existingWasher) {
      throw new NotFoundException(`Washer with ID ${id} not found`);
    }

    // Soft delete by setting state to 0
    existingWasher.state = 0;
    return this.washerRepository.save(existingWasher);
  }

  async findByPhone(phone: string): Promise<Washer | null> {
    const washer = await this.washerRepository.findOne({
      where: { phone },
    });

    return washer || null;
  }
}