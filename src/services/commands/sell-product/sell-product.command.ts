import { IOperation } from '../../common';

export class SellProductCommand implements IOperation {
  constructor(
    readonly contextId: string,
    readonly productId: string,
    readonly count: number,
  ) {}

  stringify(): string {
    return `[${SellProductCommand.name}: ${this.contextId}] selling [count=${this.count}] products [id=${this.productId}]`;
  }
}
