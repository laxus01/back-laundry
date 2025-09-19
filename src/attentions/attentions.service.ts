import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attention } from 'src/attentions/entities/attentions.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateAttentionDto, SaleProductDto, SaleServiceDto } from './dto/attention.create-attention.dto';
import { SaleService } from 'src/sales/entities/sales-services.entity';
import { Sale } from 'src/sales/entities/sales.entity';
import { Product } from 'src/products/entities/products.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { DataSource } from 'typeorm';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dayjs from 'dayjs';

@Injectable()
export class AttentionsService {
  constructor(
    @InjectRepository(Attention) private attentionRepository: Repository<Attention>,
    @InjectRepository(SaleService) private saleService: Repository<SaleService>,
    @InjectRepository(Sale) private saleProduct: Repository<Sale>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    private readonly dataSource: DataSource,
  ) {}

  async getAttentions() {
    return this.attentionRepository.find({ relations: ['vehicleId', 'washerId'] });
  }

  async getAttentionById(id: string) {
    return this.attentionRepository.findOne({
      where: { id },
      relations: ['vehicleId', 'washerId'],
    });
  }

  async getAttentionsByDateRange(startDate: string, endDate: string) {
    const start = dayjs(startDate).startOf('day').toDate();
    const end = dayjs(endDate).endOf('day').toDate();

    const attentions = await this.attentionRepository
      .createQueryBuilder('attention')
      .leftJoinAndSelect('attention.vehicleId', 'vehicle')
      .leftJoinAndSelect('attention.washerId', 'washer')
      .leftJoinAndSelect('attention.saleServices', 'saleServices')
      .leftJoinAndSelect('saleServices.serviceId', 'service')
      .where('attention.createAt >= :startDate', { startDate: start })
      .andWhere('attention.createAt <= :endDate', { endDate: end })
      .getMany();

    // Get related products for each attention
    const attentionsWithProducts = await Promise.all(
      attentions.map(async (attention) => {
        const products = await this.saleProduct
          .createQueryBuilder('sale')
          .leftJoinAndSelect('sale.productId', 'product')
          .where('sale.attentionId = :attentionId', { attentionId: attention.id })
          .getMany();

        return {
          ...attention,
          products: products.map(sale => ({
            ...sale.productId,
            quantity: sale.quantity,
            saleId: sale.id,
            saleCreateAt: sale.createAt
          }))
        };
      })
    );

    return attentionsWithProducts;
  }

  async getAttentionsByVehicleId(vehicleId: string) {
    // First, find the vehicle by ID
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Get all attentions for this vehicle
    const attentions = await this.attentionRepository
      .createQueryBuilder('attention')
      .leftJoinAndSelect('attention.vehicleId', 'vehicle')
      .leftJoinAndSelect('attention.washerId', 'washer')
      .leftJoinAndSelect('attention.saleServices', 'saleServices')
      .leftJoinAndSelect('saleServices.serviceId', 'service')
      .where('attention.vehicleId = :vehicleId', { vehicleId: vehicleId })
      .orderBy('attention.createAt', 'DESC')
      .getMany();

    // Get related products for each attention
    const attentionsWithProducts = await Promise.all(
      attentions.map(async (attention) => {
        const products = await this.saleProduct
          .createQueryBuilder('sale')
          .leftJoinAndSelect('sale.productId', 'product')
          .where('sale.attentionId = :attentionId', { attentionId: attention.id })
          .getMany();

        return {
          ...attention,
          products: products.map(sale => ({
            ...sale.productId,
            quantity: sale.quantity,
            saleId: sale.id,
            saleCreateAt: sale.createAt
          }))
        };
      })
    );

    return attentionsWithProducts;
  }

  async createAttention(attention: CreateAttentionDto) {
    const newAttention = this.attentionRepository.create(attention);
    return this.attentionRepository.save(newAttention);
  }

  async createSalesServices(salesServices: SaleServiceDto[]) {  
    const attention = await this.attentionRepository.findOne({
      where: { id: String(salesServices[0].attentionId) },
    });
    if (!attention) {
      throw new Error('Attention not found');
    }    
    const newSalesServices = salesServices.map((saleService: SaleServiceDto) => {      
      const newSaleService = this.saleService.create(saleService);
      return this.saleService.save(newSaleService);
    });
    return newSalesServices;
  }

  async createSalesProducts(sales: SaleProductDto[]) {
    const attention = await this.attentionRepository.findOne({
      where: { id: String(sales[0].attentionId) },
    });
    if (!attention) {
      throw new Error('Attention not found');
    }
    const newSales = sales.map(async (sale: SaleProductDto) => {
      const newSale = this.saleProduct.create(sale);
      await this.decreaseProductExistence(sale.productId, sale.quantity);
      return this.saleProduct.save(newSale);
    });
    return newSales;
  }  

  async decreaseProductExistence(id: DeepPartial<Product>, quantity: number) {
    const product = await this.productRepository.findOne({
      where: { id: String(id) },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.existence < quantity) {
      throw new Error('Insufficient product existence');
    }
    product.existence -= quantity;
    return this.productRepository.save(product);
  }  

  async updateAttention(id: string, attention: CreateAttentionDto) {
    const existingAttention = await this.attentionRepository.findOne({
      where: { id },
    });
    if (!existingAttention) {
      throw new Error('Attention not found');
    }
    const updatedAttention = { ...existingAttention, ...attention };
    return this.attentionRepository.save(updatedAttention);
  }

  async deleteAttention(id: string) {
    const existingAttention = await this.attentionRepository.findOne({
      where: { id },
    });
    if (!existingAttention) {
      throw new Error('Attention not found');
    }
    return this.attentionRepository.remove(existingAttention);
  }
}
