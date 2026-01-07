import { ProductModel, ProductCategoryEnum, DomainError, DomainErrorsEnum } from '../src/domain';

describe('ProductModel', () => {
  const createProduct = (data: Partial<ProductModel> = {}): ProductModel => {
    return new ProductModel({
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 50,
      category: ProductCategoryEnum.Electronics,
      ...data,
    });
  };

  describe('constructor', () => {
    it('should create a product with all properties', () => {
      const product = createProduct();

      expect(product.id).toBe('1');
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('Test Description');
      expect(product.price).toBe(100);
      expect(product.stock).toBe(50);
      expect(product.category).toBe(ProductCategoryEnum.Electronics);
    });

    it('should create a product with partial properties', () => {
      const product = new ProductModel({
        name: 'Partial Product',
        price: 50,
      });

      expect(product.name).toBe('Partial Product');
      expect(product.price).toBe(50);
      expect(product.id).toBeUndefined();
    });

    it('should create an empty product instance', () => {
      const product = new ProductModel({});

      expect(product.id).toBeUndefined();
      expect(product.name).toBeUndefined();
    });
  });

  describe('restock', () => {
    it('should increase stock by positive count', () => {
      const product = createProduct({ stock: 10 });

      product.restock(5);

      expect(product.stock).toBe(15);
    });

    it('should not change stock when count is zero', () => {
      const product = createProduct({ stock: 10 });

      product.restock(0);

      expect(product.stock).toBe(10);
    });

    it('should throw error when count is negative', () => {
      const product = createProduct({ stock: 10 });

      expect(() => product.restock(-5)).toThrow(DomainError);
      expect(() => product.restock(-5)).toThrow(
        new DomainError('Restock count has to be positive ([count=-5] was provided)', DomainErrorsEnum.NotAllowedError),
      );
    });

    it('should handle restocking to zero from negative stock (if allowed)', () => {
      const product = createProduct({ stock: 0 });

      product.restock(100);

      expect(product.stock).toBe(100);
    });

    it('should handle large restock numbers', () => {
      const product = createProduct({ stock: 100 });

      product.restock(1000000);

      expect(product.stock).toBe(1000100);
    });

    it('should throw error with correct error key', () => {
      const product = createProduct();

      try {
        product.restock(-10);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(DomainError);
        expect((error as DomainError).key).toBe(DomainErrorsEnum.NotAllowedError);
      }
    });
  });

  describe('sell', () => {
    it('should decrease stock by positive count', () => {
      const product = createProduct({ stock: 50 });

      product.sell(10);

      expect(product.stock).toBe(40);
    });

    it('should allow selling exact stock amount', () => {
      const product = createProduct({ stock: 25 });

      product.sell(25);

      expect(product.stock).toBe(0);
    });

    it('should not change stock when count is zero', () => {
      const product = createProduct({ stock: 50 });

      product.sell(0);

      expect(product.stock).toBe(50);
    });

    it('should throw error when trying to sell more than available stock', () => {
      const product = createProduct({ stock: 10 });

      expect(() => product.sell(15)).toThrow(DomainError);
      expect(() => product.sell(15)).toThrow('Stock count can not be negative');
    });

    it('should throw error when trying to sell negative count', () => {
      const product = createProduct({ stock: 50 });

      expect(() => product.sell(-5)).toThrow(DomainError);
      expect(() => product.sell(-5)).toThrow('Restock count has to be positive ([count=-5] was provided)');
    });

    it('should throw error with NotAllowedError key for overselling', () => {
      const product = createProduct({ stock: 10 });

      try {
        product.sell(20);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(DomainError);
        expect((error as DomainError).key).toBe(DomainErrorsEnum.NotAllowedError);
      }
    });

    it('should throw error with NotAllowedError key for negative sell count', () => {
      const product = createProduct({ stock: 50 });

      try {
        product.sell(-10);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(DomainError);
        expect((error as DomainError).key).toBe(DomainErrorsEnum.NotAllowedError);
      }
    });

    it('should handle sequential sells', () => {
      const product = createProduct({ stock: 100 });

      product.sell(25);
      expect(product.stock).toBe(75);

      product.sell(25);
      expect(product.stock).toBe(50);

      product.sell(50);
      expect(product.stock).toBe(0);
    });

    it('should throw error on third sell when stock becomes negative', () => {
      const product = createProduct({ stock: 100 });

      product.sell(25);
      product.sell(75);

      expect(() => product.sell(1)).toThrow('Stock count can not be negative');
    });
  });

  describe('product categories', () => {
    it('should support all product categories', () => {
      const categories = [
        ProductCategoryEnum.Books,
        ProductCategoryEnum.Clothes,
        ProductCategoryEnum.Electronics,
        ProductCategoryEnum.Furnitures,
      ];

      categories.forEach((category) => {
        const product = createProduct({ category });
        expect(product.category).toBe(category);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero initial stock', () => {
      const product = createProduct({ stock: 0 });

      expect(product.stock).toBe(0);
      expect(() => product.sell(1)).toThrow('Stock count can not be negative');
    });

    it('should handle empty product name', () => {
      const product = createProduct({ name: '' });

      expect(product.name).toBe('');
    });

    it('should handle zero price', () => {
      const product = createProduct({ price: 0 });

      expect(product.price).toBe(0);
    });

    it('should handle negative prices (if allowed by business logic)', () => {
      const product = createProduct({ price: -100 });

      expect(product.price).toBe(-100);
    });

    it('should handle very large stock numbers', () => {
      const product = createProduct({ stock: Number.MAX_SAFE_INTEGER });

      expect(product.stock).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle decimal prices', () => {
      const product = createProduct({ price: 99.99 });

      expect(product.price).toBe(99.99);
    });

    it('should handle special characters in name and description', () => {
      const specialName = 'Product @#$%^&*()';
      const specialDesc = 'Description with <html> tags & symbols!';
      const product = createProduct({
        name: specialName,
        description: specialDesc,
      });

      expect(product.name).toBe(specialName);
      expect(product.description).toBe(specialDesc);
    });

    it('should handle very long names and descriptions', () => {
      const longName = 'A'.repeat(1000);
      const longDesc = 'B'.repeat(5000);
      const product = createProduct({
        name: longName,
        description: longDesc,
      });

      expect(product.name).toBe(longName);
      expect(product.description).toBe(longDesc);
    });
  });

  describe('shouldUpdateStockCount', () => {
    it('should reject negative counts', () => {
      const product = createProduct({ stock: 50 });

      expect(() => product.sell(-1)).toThrow();
      expect(() => product.restock(-1)).toThrow();
    });

    it('should accept positive counts', () => {
      const product = createProduct({ stock: 50 });

      product.sell(1);
      expect(product.stock).toBe(49);

      product.restock(1);
      expect(product.stock).toBe(50);
    });
  });
});
