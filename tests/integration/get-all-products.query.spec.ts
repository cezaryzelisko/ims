import 'reflect-metadata';

import { PageModel, PageOptionsModel, ProductModel } from '../../src/domain';
import { GenericBus, GetAllProductsQuery, GetAllProductsQueryHandler } from '../../src/services';
import { InMemoryDB, IUnitOfWork } from '../../src/unit-of-work';
import { saveProduct } from './utils';

describe('GetAllProductsQuery', () => {
  let unitOfWork: IUnitOfWork;
  const bus = new GenericBus();
  const productsCount = 25;

  beforeEach(async () => {
    unitOfWork = new InMemoryDB();
    bus.register(GetAllProductsQuery.name, new GetAllProductsQueryHandler(unitOfWork));
    await Promise.all(
      Array(productsCount)
        .fill(null)
        .map(() => saveProduct(unitOfWork)),
    );
  });

  afterEach(() => {
    unitOfWork = new InMemoryDB();
  });

  it('should return all products stored in the DB allowed by default page options', async () => {
    const query = new GetAllProductsQuery('context-id');

    const products = await bus.execute<GetAllProductsQuery, PageModel<ProductModel>>(query);

    expect(products).toBeDefined();
    expect(products.count).toBe(productsCount);
    expect(products.data).toBeDefined();
    expect(products.data.length).toBe(10);
    expect(products.options).toBeDefined();
    expect(products.options.limit).toBe(10);
    expect(products.options.offset).toBe(0);
    expect(products.pagesCount).toBe(3);
  });

  it('should return all products stored in the DB respecting page options', async () => {
    const query = new GetAllProductsQuery('context-id', new PageOptionsModel(5, 10));

    const products = await bus.execute<GetAllProductsQuery, PageModel<ProductModel>>(query);

    expect(products).toBeDefined();
    expect(products.count).toBe(productsCount);
    expect(products.data).toBeDefined();
    expect(products.data.length).toBe(5);
    expect(products.options).toBeDefined();
    expect(products.options.limit).toBe(5);
    expect(products.options.offset).toBe(10);
    expect(products.pagesCount).toBe(5);
  });

  it('should return an empty page if offset provided in page options is greater than number of products in the DB', async () => {
    const query = new GetAllProductsQuery('context-id', new PageOptionsModel(10, productsCount + 1));

    const products = await bus.execute<GetAllProductsQuery, PageModel<ProductModel>>(query);

    expect(products).toBeDefined();
    expect(products.count).toBe(productsCount);
    expect(products.data).toBeDefined();
    expect(products.data.length).toBe(0);
    expect(products.options).toBeDefined();
    expect(products.options.limit).toBe(10);
    expect(products.options.offset).toBe(productsCount + 1);
    expect(products.pagesCount).toBe(3);
  });
});
