import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CustomerEntity } from './customer.entity';
import { OrderModel } from '../../../../domain';
import { numericColumnTransformer } from '../utils';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'numeric', transformer: numericColumnTransformer })
  price!: number;

  @ManyToOne(() => CustomerEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  customer!: CustomerEntity;

  @RelationId<OrderEntity>((order) => order.customer)
  customerId!: string;

  @ManyToMany(() => ProductEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinTable()
  products!: ProductEntity[];

  static fromDomain(model: OrderModel): OrderEntity {
    const entity = new OrderEntity();
    entity.price = model.price!;
    entity.customer = new CustomerEntity();
    entity.customer.id = model.customerId;
    entity.products = model.productIds.map((productId) => {
      const productEntity = new ProductEntity();
      productEntity.id = productId;

      return productEntity;
    });

    return entity;
  }

  static toDomain(entity: OrderEntity): OrderModel {
    return new OrderModel({
      id: entity.id,
      price: entity.price,
      customerId: entity.customerId,
      productIds: entity.products.map((product) => product.id),
    });
  }
}
