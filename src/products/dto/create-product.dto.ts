export class CreateProductDto {
  id?: string;
  product: string;
  valueBuys: number;
  saleValue: number;
  existence: number;
  state?: number;
}
