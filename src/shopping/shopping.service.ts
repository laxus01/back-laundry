import { Injectable, Logger, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateShoppingDto, UpdateShoppingDto } from './dto/create-shopping.dto';
import { Shopping } from './entities/shopping.entity';
import { IDateRangeQuery, IShoppingRepository, SHOPPING_REPOSITORY_TOKEN } from './interfaces/shopping-manager.interface';
import { IInventoryManager, INVENTORY_MANAGER_TOKEN } from '../sales/interfaces/inventory-manager.interface';

@Injectable()
export class ShoppingService {
  private readonly logger = new Logger(ShoppingService.name);

  constructor(
    @Inject(SHOPPING_REPOSITORY_TOKEN)
    private readonly shoppingRepository: IShoppingRepository,
    @Inject(INVENTORY_MANAGER_TOKEN)
    private readonly inventoryManager: IInventoryManager,
    private readonly dataSource: DataSource,
  ) {}

  async getShoppings(startDate?: string, endDate?: string): Promise<Shopping[]> {
    this.logger.log(`Fetching shoppings with date range: ${startDate} - ${endDate}`);
    
    // If date range is provided, use date filtering
    if (startDate && endDate) {
      const dateRange: IDateRangeQuery = { startDate, endDate };
      return this.shoppingRepository.findByDateRange(dateRange);
    }

    // Default behavior when no date range is provided
    return this.shoppingRepository.findAll();
  }

  async getShoppingById(id: string): Promise<Shopping | null> {
    this.logger.log(`Fetching shopping with ID: ${id}`);
    
    return this.shoppingRepository.findById(id);
  }

  async createShopping(shoppingData: CreateShoppingDto): Promise<Shopping> {
    this.logger.log(`Creating new shopping for product: ${shoppingData.productId}`);

    return this.dataSource.transaction(async (manager) => {
      // Create the shopping first
      const shopping = await this.shoppingRepository.create(shoppingData);

      // Then increase stock (purchases increase inventory)
      await this.inventoryManager.increaseStock(
        shoppingData.productId,
        shoppingData.quantity
      );
      
      this.logger.log(`Shopping created successfully with ID: ${shopping.id}`);
      return shopping;
    });
  }

  async updateShopping(id: string, shoppingData: UpdateShoppingDto): Promise<Shopping> {
    this.logger.log(`Updating shopping with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      const currentShopping = await this.shoppingRepository.findByIdWithProduct(id);
      
      // If quantity or product is being updated, adjust inventory
      if (shoppingData.quantity !== undefined || shoppingData.productId !== undefined) {
        // First, revert the previous inventory change (decrease by old quantity)
        await this.inventoryManager.decreaseStock(
          currentShopping.productId,
          currentShopping.quantity
        );

        // Then apply the new inventory change (increase by new quantity)
        const newProductId = shoppingData.productId || currentShopping.productId;
        const newQuantity = shoppingData.quantity !== undefined ? shoppingData.quantity : currentShopping.quantity;
        
        await this.inventoryManager.increaseStock(newProductId, newQuantity);
      }

      // Update the shopping record
      const updatedShopping = await this.shoppingRepository.update(id, shoppingData);
      
      this.logger.log(`Shopping updated successfully: ${id}`);
      return updatedShopping;
    });
  }

  async deleteShopping(id: string): Promise<void> {
    this.logger.log(`Deleting shopping with ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Get shopping with product information
      const shopping = await this.shoppingRepository.findByIdWithProduct(id);
      
      // Revert inventory (decrease stock since we're removing a purchase)
      await this.inventoryManager.decreaseStock(
        shopping.productId,
        shopping.quantity
      );

      // Delete the shopping
      await this.shoppingRepository.delete(id);
      
      this.logger.log(`Shopping deleted successfully: ${id}`);
    });
  }
}
