import { IOperation } from '../../common';

export class RestockProductCommand implements IOperation {
  constructor(
    readonly contextId: string,
    readonly productId: string,
    readonly count: number,
  ) {}

  stringify(): string {
    return `[${RestockProductCommand.name}: ${this.contextId}] restocking [count=${this.count}] products [id=${this.productId}]`;
  }
}
