import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateSaleDto, UpdateSaleDto } from './dto/sale.dto';
import { Sale } from './entities/sales.entity';
import { IInventoryManager, IDateRangeQuery } from './interfaces/inventory-manager.interface';
import { SalesRepository } from './repositories/sales.repository';
import { INVENTORY_MANAGER_TOKEN } from './interfaces/inventory-manager.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    @Inject(INVENTORY_MANAGER_TOKEN)
    private readonly inventoryManager: IInventoryManager,
    private readonly salesRepository: SalesRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getSales(startDate: string, endDate: string): Promise<Sale[]> {
    this.logger.log(`Fetching sales from ${startDate} to ${endDate}`);
    
    const dateRange: IDateRangeQuery = { startDate, endDate };
    return this.salesRepository.findByDateRange(dateRange);
  }

  async getSaleById(id: string): Promise<Sale | null> {
    this.logger.log(`Fetching sale with ID: ${id}`);
    
    return this.salesRepository.findById(id);
  }

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    this.logger.log(`Creating new sale for product: ${saleData.productId}`);

    return this.dataSource.transaction(async (manager) => {
      // Validate and decrease stock first
      await this.inventoryManager.decreaseStock(
        saleData.productId.toString(),
        saleData.quantity
      );

      // Create the sale
      const sale = await this.salesRepository.create(saleData);
      
      this.logger.log(`Sale created successfully with ID: ${sale.id}`);
      return sale;
    });
  }

  async deleteSale(id: string): Promise<void> {
    this.logger.log(`Deleting sale with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Get sale with product information
      const sale = await this.salesRepository.findByIdWithProduct(id);
      
      // Restore inventory
      await this.inventoryManager.increaseStock(
        sale.productId.id,
        sale.quantity
      );

      // Delete the sale
      await this.salesRepository.delete(id);
      
      this.logger.log(`Sale deleted successfully: ${id}`);
    });
  }

  async updateSale(id: string, saleData: UpdateSaleDto): Promise<Sale> {
    return this.dataSource.transaction(async (manager) => {
      const currentSale = await this.salesRepository.findByIdWithProduct(id);      
      if (saleData.quantity !== undefined || saleData.productId !== undefined) {
        await this.inventoryManager.increaseStock(
          currentSale.productId.id,
          currentSale.quantity
        );
        const newProductId = saleData.productId ? saleData.productId.toString() : currentSale.productId.id;
        const newQuantity = saleData.quantity !== undefined ? saleData.quantity : currentSale.quantity;
        await this.inventoryManager.decreaseStock(newProductId, newQuantity);
      }
      const updatedSale = await this.salesRepository.update(id, saleData);
      return updatedSale;
    });
  }
}
