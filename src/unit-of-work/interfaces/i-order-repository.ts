import { OrderModel } from '../../domain';

export interface IOrderRepository {
  orderProducts(order: OrderModel): Promise<OrderModel>;
}
