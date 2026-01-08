import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { IOrderRepository } from '../../../interfaces';
import { OrderModel } from '../../../../domain';

export class OrderRepository extends Repository<OrderEntity> implements IOrderRepository {
  async orderProducts(order: OrderModel): Promise<OrderModel> {
    const entity = await this.save(OrderEntity.fromDomain(order));
    return OrderEntity.toDomain(entity);
  }
}
