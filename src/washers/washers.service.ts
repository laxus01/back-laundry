import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Washer } from 'src/entities/washers.entity';
import { Repository } from 'typeorm';
import { CreateWasherDto } from './dto/washers.dto';

@Injectable()
export class WashersService {
  constructor(
    @InjectRepository(Washer) private washerRepository: Repository<Washer>,
  ) {}

  async getWashers() {
    return this.washerRepository.find({
      where: { state: 1 },
    });
  }

  async getWasherById(id: string) {
    return this.washerRepository.findOne({
      where: { id },
    });
  }

  async createWasher(washer: CreateWasherDto) {
    const newWasher = this.washerRepository.create(washer);
    return this.washerRepository.save(newWasher);
  }

  async updateWasher(id: string, washer: CreateWasherDto) {
    const existingWasher = await this.washerRepository.findOne({
      where: { id },
    });
    if (!existingWasher) {
      throw new Error('Washer not found');
    }
    const updatedWasher = { ...existingWasher, ...washer };
    return this.washerRepository.save(updatedWasher);
  }

  async deleteWasher(id: string) {
    const existingWasher = await this.washerRepository.findOne({
      where: { id },
    });
    if (!existingWasher) {
      throw new Error('Washer not found');
    }
    existingWasher.state = 0;
    return this.washerRepository.save(existingWasher);
  }
}