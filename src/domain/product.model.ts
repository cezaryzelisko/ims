import { DomainError } from './domain-error.model';
import { DomainErrorsEnum } from './domain-errors.enum';

export class ProductModel {
  id?: string;
  name!: string;
  description!: string;
  price!: number;
  stock!: number;

  constructor(data: Partial<ProductModel>) {
    Object.assign(this, data);
  }

  restock(count: number): void {
    if (!this.shouldUpdateStockCount(count)) {
      return;
    }

    this.stock += count;
  }

  sell(count: number): void {
    if (!this.shouldUpdateStockCount(count)) {
      return;
    } else if (this.stock - count < 0) {
      throw new DomainError('Stock count can not be negative', DomainErrorsEnum.NotAllowedError);
    }

    this.stock -= count;
  }

  private shouldUpdateStockCount(count: number): boolean {
    if (count < 0) {
      throw new DomainError(
        `Restock count has to be positive ([count=${count}] was provided)`,
        DomainErrorsEnum.NotAllowedError,
      );
    } else if (count === 0) {
      return false;
    }

    return true;
  }
}
