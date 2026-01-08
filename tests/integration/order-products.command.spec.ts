import 'reflect-metadata';

import { RegionEnum, OrderModel, DomainError, DomainErrorsEnum } from '../../src/domain';
import { GenericBus, OrderProductsCommand, OrderProductsCommandHandler } from '../../src/services';
import { InMemoryDB, IUnitOfWork } from '../../src/unit-of-work';
import { v4 } from 'uuid';
import { saveProduct } from './utils';

describe('OrderProductsCommand', () => {
  let unitOfWork: IUnitOfWork;
  const bus = new GenericBus();

  beforeEach(async () => {
    unitOfWork = new InMemoryDB();
    bus.register(OrderProductsCommand.name, new OrderProductsCommandHandler(unitOfWork));
  });

  afterEach(() => {
    unitOfWork = new InMemoryDB();
  });

  it('should order products successfully', async () => {
    const product1 = await saveProduct(unitOfWork);
    const product2 = await saveProduct(unitOfWork);
    const command = new OrderProductsCommand('context-id', v4(), RegionEnum.US, [product1.id!, product2.id!]);

    const result = await bus.execute<OrderProductsCommand, OrderModel>(command);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.customerId).toBe(command.customerId);
    expect(result.productIds).toEqual(command.productIds);
    expect(result.price).toBeDefined();
    expect(typeof result.price).toBe('number');
  });

  it('should throw validation error for invalid customer id', async () => {
    const product = await saveProduct(unitOfWork);
    const command = new OrderProductsCommand('context-id', 'invalid-id', RegionEnum.US, [product.id!]);

    try {
      await bus.execute<OrderProductsCommand, OrderModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.ValidationError);
    }
  });

  it('should throw validation error for invalid product ids', async () => {
    const command = new OrderProductsCommand('context-id', v4(), RegionEnum.US, ['invalid-id']);

    try {
      await bus.execute<OrderProductsCommand, OrderModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.ValidationError);
    }
  });

  it('should throw not allowed error for no products', async () => {
    const command = new OrderProductsCommand('context-id', v4(), RegionEnum.US, []);

    try {
      await bus.execute<OrderProductsCommand, OrderModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.NotAllowedError);
    }
  });

  it('should throw not allowed error for insufficient stock', async () => {
    const product = await saveProduct(unitOfWork); // stock = 5
    const command = new OrderProductsCommand(
      'context-id',
      v4(),
      RegionEnum.US,
      [product.id!, product.id!, product.id!, product.id!, product.id!, product.id!], // 6 times, more than 5
    );

    try {
      await bus.execute<OrderProductsCommand, OrderModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.NotAllowedError);
    }
  });
});
