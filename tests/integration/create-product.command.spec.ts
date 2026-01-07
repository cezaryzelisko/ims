import 'reflect-metadata';

import { CreateProductCommand, CreateProductCommandHandler, GenericBus } from '../../src/services';
import { InMemoryDB, IUnitOfWork } from '../../src/unit-of-work';
import { ProductModel, ProductCategoryEnum, DomainError, DomainErrorsEnum } from '../../src/domain';

describe('CreateProductCommand', () => {
  let unitOfWork: IUnitOfWork;
  const bus = new GenericBus();

  beforeEach(async () => {
    unitOfWork = new InMemoryDB();
    bus.register(CreateProductCommand.name, new CreateProductCommandHandler(unitOfWork));
  });

  afterEach(() => {
    unitOfWork = new InMemoryDB();
  });

  it('should create a product successfully', async () => {
    const product = new ProductModel({
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      stock: 5,
      category: ProductCategoryEnum.Books,
    });
    const command = new CreateProductCommand('context-id', product);

    const result = await bus.execute<CreateProductCommand, ProductModel>(command);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(product.name);
    expect(result.description).toBe(product.description);
    expect(result.price).toBe(product.price);
    expect(result.stock).toBe(product.stock);
    expect(result.category).toBe(product.category);
  });

  it('should throw validation error for invalid product data', async () => {
    const product = new ProductModel({
      name: '', // invalid: empty name
      description: 'Test Description',
      price: -1, // invalid: negative price
      stock: 5,
      category: ProductCategoryEnum.Books,
    });
    const command = new CreateProductCommand('context-id', product);

    try {
      await bus.execute<CreateProductCommand, ProductModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.ValidationError);
    }
  });

  it('should throw validation error for missing required fields', async () => {
    const product = new ProductModel({
      name: 'Test Product',
      // missing description
      price: 10.99,
      stock: 5,
      category: ProductCategoryEnum.Books,
    });
    const command = new CreateProductCommand('context-id', product);

    try {
      await bus.execute<CreateProductCommand, ProductModel>(command);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).key).toBe(DomainErrorsEnum.ValidationError);
    }
  });
});
