import 'reflect-metadata';

import { GenericBus, RestockProductCommand, RestockProductCommandHandler } from '../../src/services';
import { InMemoryDB, IUnitOfWork } from '../../src/unit-of-work';
import { ProductModel, DomainError, DomainErrorsEnum } from '../../src/domain';
import { saveProduct } from './utils';

describe('RestockProductCommand', () => {
  let unitOfWork: IUnitOfWork;
  const bus = new GenericBus();

  beforeEach(async () => {
    unitOfWork = new InMemoryDB();
    bus.register(RestockProductCommand.name, new RestockProductCommandHandler(unitOfWork));
  });

  afterEach(() => {
    unitOfWork = new InMemoryDB();
  });

  it('should restock a product successfully', async () => {
    const savedProduct = await saveProduct(unitOfWork);
    const initialStock = savedProduct.stock;
    const command = new RestockProductCommand('context-id', savedProduct.id!, 10);

    const result = await bus.execute<RestockProductCommand, ProductModel>(command);

    expect(result).toBeDefined();
    expect(result.id).toBe(savedProduct.id);
    expect(result.stock).toBe(initialStock + 10);
  });

  it('should throw validation error for invalid count (<1)', async () => {
    const savedProduct = await saveProduct(unitOfWork);
    const command = new RestockProductCommand('context-id', savedProduct.id!, 0);

    try {
      await bus.execute<RestockProductCommand, ProductModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.ValidationError);
    }
  });

  it('should throw not found error for non-existent product', async () => {
    const command = new RestockProductCommand('context-id', 'non-existent-id', 5);

    try {
      await bus.execute<RestockProductCommand, ProductModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.NotFoundError);
    }
  });
});
