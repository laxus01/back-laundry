import { Sale } from "../entities/sales.entity";
import { CreateSaleDto, UpdateSaleDto } from "../dto/sale.dto";

export interface IInventoryManager {
    decreaseStock(productId: string, quantity: number): Promise<void>;
    increaseStock(productId: string, quantity: number): Promise<void>;
    validateStock(productId: string, quantity: number): Promise<boolean>;
  }
  
  // Token for dependency injection
  export const INVENTORY_MANAGER_TOKEN = 'INVENTORY_MANAGER_TOKEN';
  
  export interface IDateRangeQuery {
    startDate: string;
    endDate: string;
  }
  
  export interface ISalesRepository {
    findByDateRange(dateRange: IDateRangeQuery): Promise<Sale[]>;
    findById(id: string): Promise<Sale | null>;
    findByIdWithProduct(id: string): Promise<Sale>;
    create(saleData: CreateSaleDto): Promise<Sale>;
    update(id: string, saleData: UpdateSaleDto): Promise<Sale>;
    delete(id: string): Promise<void>;
  }