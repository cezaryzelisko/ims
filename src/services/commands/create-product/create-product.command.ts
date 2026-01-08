import { ProductModel } from '../../../domain';
import { IOperation } from '../../common';

export class CreateProductCommand implements IOperation {
  constructor(
    readonly contextId: string,
    readonly product: ProductModel,
  ) {}

  stringify(): string {
    return `[${CreateProductCommand.name}: ${this.contextId}] creating new product [name=${this.product.name}, description=${this.product.description}, price=${this.product.price}, stack=${this.product.stock}]`;
  }
}
