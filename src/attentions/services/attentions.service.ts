import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { IAttentionsRepository, ATTENTIONS_REPOSITORY_TOKEN } from '../interfaces/attentions-manager.interface';
import { Attention } from '../entities/attentions.entity';
import { CreateAttentionDto, UpdateAttentionDto } from '../dto/attention.create-attention.dto';
import { SaleService } from '../../sales/entities/sales-services.entity';
import { Sale } from '../../sales/entities/sales.entity';
import { Product } from '../../products/entities/products.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AttentionsService {
  private readonly logger = new Logger(AttentionsService.name);

  constructor(
    @Inject(ATTENTIONS_REPOSITORY_TOKEN)
    private readonly attentionsRepository: IAttentionsRepository,
    @InjectRepository(SaleService)
    private readonly saleServiceRepository: Repository<SaleService>,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Attention[]> {
    this.logger.log('Fetching all attentions');
    try {
      return await this.attentionsRepository.findAll();
    } catch (error) {
      this.logger.error('Error fetching attentions', error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Attention> {
    this.logger.log(`Fetching attention with ID: ${id}`);
    try {
      const attention = await this.attentionsRepository.findById(id);
      if (!attention) {
        throw new NotFoundException(`Attention with ID ${id} not found`);
      }
      return attention;
    } catch (error) {
      this.logger.error(`Error fetching attention with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async create(createAttentionDto: CreateAttentionDto): Promise<Attention> {
    this.logger.log('Creating a new attention');
    try {
      // Aquí podrías agregar lógica de negocio adicional
      return await this.attentionsRepository.create(createAttentionDto);
    } catch (error) {
      this.logger.error('Error creating attention', error.stack);
      throw error;
    }
  }

  async update(id: string, updateAttentionDto: UpdateAttentionDto): Promise<Attention> {
    this.logger.log(`Updating attention with ID: ${id}`);
    try {
      // Verificar que existe antes de actualizar
      await this.findOne(id);
      return await this.attentionsRepository.update(id, updateAttentionDto);
    } catch (error) {
      this.logger.error(`Error updating attention with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting attention with ID: ${id}`);
    try {
      const result = await this.attentionsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Attention with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error deleting attention with ID: ${id}`, error.stack);
      throw error;
    }
  }
}