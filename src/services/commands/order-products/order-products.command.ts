import { RegionEnum } from '../../../domain';
import { IOperation } from '../../common';

export class OrderProductsCommand implements IOperation {
  constructor(
    readonly contextId: string,
    readonly customerId: string,
    readonly region: RegionEnum,
    readonly productIds: string[],
  ) {}

  stringify(): string {
    return `[${OrderProductsCommand.name}: ${this.contextId}] customer [id=${this.customerId}] from [region=${this.region}] is ordering the following products: [ids=${this.productIds}]`;
  }
}
