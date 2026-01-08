import { OrderModel } from '../../domain';

export class OrderDto {
  constructor(
    readonly id: string,
    readonly price: number,
    readonly customerId: string,
    readonly productIds: string[],
  ) {}

  static fromDomain(model: OrderModel): OrderDto {
    return new OrderDto(model.id!, model.price!, model.customerId, model.productIds);
  }
}
