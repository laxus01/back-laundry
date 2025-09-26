import { Shopping } from "../entities/shopping.entity";
import { CreateShoppingDto, UpdateShoppingDto } from "../dto/create-shopping.dto";

export interface IDateRangeQuery {
  startDate: string;
  endDate: string;
}

export interface IShoppingRepository {
  findByDateRange(dateRange: IDateRangeQuery): Promise<Shopping[]>;
  findAll(): Promise<Shopping[]>;
  findById(id: string): Promise<Shopping | null>;
  findByIdWithProduct(id: string): Promise<Shopping>;
  create(shoppingData: CreateShoppingDto): Promise<Shopping>;
  update(id: string, shoppingData: UpdateShoppingDto): Promise<Shopping>;
  delete(id: string): Promise<void>;
}

// Token for dependency injection
export const SHOPPING_REPOSITORY_TOKEN = 'SHOPPING_REPOSITORY_TOKEN';
