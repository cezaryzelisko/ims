import { PageOptionsModel } from '../../../domain';
import { IOperation } from '../../common';

export class GetAllProductsQuery implements IOperation {
  constructor(
    readonly contextId: string,
    readonly options?: PageOptionsModel,
  ) {}

  stringify(): string {
    return `[${GetAllProductsQuery.name}: ${this.contextId}] getting a list of all products [limit=${this.options?.limit}, offset=${this.options?.offset}]`;
  }
}
