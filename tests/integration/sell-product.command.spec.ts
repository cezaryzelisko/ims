import 'reflect-metadata';

import { GenericBus, SellProductCommand, SellProductCommandHandler } from '../../src/services';
import { InMemoryDB, IUnitOfWork } from '../../src/unit-of-work';
import { ProductModel, DomainError, DomainErrorsEnum } from '../../src/domain';
import { saveProduct } from './utils';

describe('SellProductCommand', () => {
  let unitOfWork: IUnitOfWork;
  const bus = new GenericBus();

  beforeEach(async () => {
    unitOfWork = new InMemoryDB();
    bus.register(SellProductCommand.name, new SellProductCommandHandler(unitOfWork));
  });

  afterEach(() => {
    unitOfWork = new InMemoryDB();
  });

  it('should sell a product successfully', async () => {
    const savedProduct = await saveProduct(unitOfWork);
    const initialStock = savedProduct.stock;
    const command = new SellProductCommand('context-id', savedProduct.id!, 3);

    const result = await bus.execute<SellProductCommand, ProductModel>(command);

    expect(result).toBeDefined();
    expect(result.id).toBe(savedProduct.id);
    expect(result.stock).toBe(initialStock - 3);
  });

  it('should throw validation error for invalid count', async () => {
    const savedProduct = await saveProduct(unitOfWork);
    const command = new SellProductCommand('context-id', savedProduct.id!, 0);

    try {
      await bus.execute<SellProductCommand, ProductModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.ValidationError);
    }
  });

  it('should throw not found error for non-existent product', async () => {
    const command = new SellProductCommand('context-id', 'non-existent-id', 1);

    try {
      await bus.execute<SellProductCommand, ProductModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.NotFoundError);
    }
  });

  it('should throw not allowed error for insufficient stock', async () => {
    const savedProduct = await saveProduct(unitOfWork); // stock = 5
    const command = new SellProductCommand('context-id', savedProduct.id!, 10);

    try {
      await bus.execute<SellProductCommand, ProductModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.NotAllowedError);
    }
  });
});
