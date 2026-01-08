import { OrderModel } from '../../../domain';
import { IOrderRepository } from '../../interfaces';
import { InMemoryRepository } from './in-memory.repository';

export class OrderRepository extends InMemoryRepository<OrderModel> implements IOrderRepository {
  async orderProducts(order: OrderModel): Promise<OrderModel> {
    return this.persist(order);
  }
}
