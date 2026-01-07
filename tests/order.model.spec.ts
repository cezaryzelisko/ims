import { ProductModel, ProductCategoryEnum, OrderModel, RegionEnum } from '../src/domain';

describe('OrderModel', () => {
  const createProduct = (data: Partial<ProductModel> = {}): ProductModel => {
    return new ProductModel({
      id: '1',
      name: 'Test Product',
      description: 'Test',
      price: 100,
      stock: 50,
      category: ProductCategoryEnum.Electronics,
      ...data,
    });
  };

  describe('constructor', () => {
    it('should create an order with all properties', () => {
      const order = new OrderModel({
        id: 'order-1',
        price: 500,
        customerId: 'cust-1',
        productIds: ['prod-1', 'prod-2'],
      });

      expect(order.id).toBe('order-1');
      expect(order.price).toBe(500);
      expect(order.customerId).toBe('cust-1');
      expect(order.productIds).toEqual(['prod-1', 'prod-2']);
    });

    it('should create an order with partial properties', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1'],
      });

      expect(order.customerId).toBe('cust-1');
      expect(order.productIds).toEqual(['prod-1']);
      expect(order.id).toBeUndefined();
      expect(order.price).toBeUndefined();
    });

    it('should create an empty order instance', () => {
      const order = new OrderModel({});

      expect(order.id).toBeUndefined();
      expect(order.price).toBeUndefined();
    });
  });

  describe('calculateOrderValue - ordinary orders', () => {
    it('should calculate total for single product', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      const products = [createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(100);
    });

    it('should calculate total for multiple products in US region', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1', 'prod-2', 'prod-3'],
      });
      const products = [createProduct({ price: 100 }), createProduct({ price: 50 }), createProduct({ price: 75 })];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(225);
    });

    it('should apply Europe region pricing (15% markup)', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      const products = [createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.Europe);

      expect(order.price).toBe(115);
    });

    it('should apply Asia region pricing (5% discount)', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      const products = [createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.Asia);

      expect(order.price).toBe(95);
    });

    it('should handle multiple products with region markup', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1', 'prod-2'],
      });
      const products = [createProduct({ price: 100 }), createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.Europe);

      expect(order.price).toBe(230); // (100 + 100) * 1.15
    });
  });

  describe('calculateOrderValue - volume discount', () => {
    it('should apply 10% discount for 5+ products', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(5).fill('prod'),
      });
      const products = Array(5).fill(createProduct({ price: 100 }));

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(450); // 500 - (500 * 0.1)
    });

    it('should apply 20% discount for 10+ products', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(10).fill('prod'),
      });
      const products = Array(10).fill(createProduct({ price: 100 }));

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(800); // 1000 - (1000 * 0.2)
    });

    it('should apply 30% discount for 50+ products', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(50).fill('prod'),
      });
      const products = Array(50).fill(createProduct({ price: 100 }));

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(3500); // 5000 - (5000 * 0.3)
    });

    it('should apply exactly 10% for 5 products', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(5).fill('prod'),
      });
      const products = Array(5).fill(createProduct({ price: 50 }));

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(225); // 250 - (250 * 0.1)
    });

    it('should apply exactly 20% for 10 products', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(10).fill('prod'),
      });
      const products = Array(10).fill(createProduct({ price: 50 }));

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(400); // 500 - (500 * 0.2)
    });

    it('should apply exactly 30% for 50 products', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(50).fill('prod'),
      });
      const products = Array(50).fill(createProduct({ price: 50 }));

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(1750); // 2500 - (2500 * 0.3)
    });

    it('should not apply discount for 4 products', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(4).fill('prod'),
      });
      const products = Array(4).fill(createProduct({ price: 100 }));

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(400);
    });
  });

  describe('calculateOrderValue - seasonal discounts', () => {
    it('should detect holiday sales in July (month 6)', () => {
      // Mock date to be in July
      const originalDate = Date;
      const mockDate = new Date(2024, 6, 15); // July 15, 2024
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['book1', 'book2', 'electronics1', 'clothes1', 'furniture1'],
      });
      const products = [
        createProduct({ price: 100, category: ProductCategoryEnum.Books }),
        createProduct({ price: 100, category: ProductCategoryEnum.Books }),
        createProduct({ price: 100, category: ProductCategoryEnum.Electronics }),
        createProduct({ price: 100, category: ProductCategoryEnum.Clothes }),
        createProduct({ price: 100, category: ProductCategoryEnum.Furnitures }),
      ];

      order.calculateOrderValue(products, RegionEnum.US);

      // Books and Electronics get 15% discount: (100 + 100 + 100) * 0.15 = 45
      // Total: 500, Discount: 45, Price: 455
      expect(order.price).toBe(455);

      jest.restoreAllMocks();
    });

    it('should detect holiday sales in August (month 7)', () => {
      const mockDate = new Date(2024, 7, 15); // August 15, 2024
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['book1', 'electronics1'],
      });
      const products = [
        createProduct({ price: 100, category: ProductCategoryEnum.Books }),
        createProduct({ price: 100, category: ProductCategoryEnum.Electronics }),
      ];

      order.calculateOrderValue(products, RegionEnum.US);

      // Both promotional: 200 * 0.15 = 30 discount
      expect(order.price).toBe(170);

      jest.restoreAllMocks();
    });

    it('should not apply holiday discount for non-promotional categories', () => {
      const mockDate = new Date(2024, 6, 15); // July
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['clothes1', 'furniture1'],
      });
      const products = [
        createProduct({ price: 100, category: ProductCategoryEnum.Clothes }),
        createProduct({ price: 100, category: ProductCategoryEnum.Furnitures }),
      ];

      order.calculateOrderValue(products, RegionEnum.US);

      // No promotional items, no discount
      expect(order.price).toBe(200);

      jest.restoreAllMocks();
    });
  });

  describe('calculateOrderValue - black friday', () => {
    it('should apply 25% discount on black friday', () => {
      // Black Friday is the last Friday of November
      const mockDate = new Date(2024, 10, 29); // Last Friday of November 2024
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1', 'prod-2'],
      });
      const products = [createProduct({ price: 100 }), createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.US);

      // 200 - (200 * 0.25) = 150
      expect(order.price).toBe(150);

      jest.restoreAllMocks();
    });

    it('should not apply black friday discount on non-black friday dates', () => {
      const mockDate = new Date(2024, 10, 22); // Not Friday
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1'],
      });
      const products = [createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(100);

      jest.restoreAllMocks();
    });
  });

  describe('calculateOrderValue - discount precedence', () => {
    it('should apply maximum discount when both seasonal and volume apply', () => {
      const mockDate = new Date(2024, 6, 15); // July - holiday season
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(10).fill('prod'), // 10 items = 20% volume discount
      });
      const products = Array(5)
        .fill(null)
        .flatMap(() => [
          createProduct({ price: 100, category: ProductCategoryEnum.Books }),
          createProduct({ price: 100, category: ProductCategoryEnum.Electronics }),
        ]);

      order.calculateOrderValue(products, RegionEnum.US);

      // Total: 1000
      // Seasonal discount (Books + Electronics): 1000 * 0.15 = 150
      // Volume discount (10 items): 1000 * 0.2 = 200
      // Max discount: 200
      // Price: 800
      expect(order.price).toBe(800);

      jest.restoreAllMocks();
    });

    it('should use maximum between seasonal and volume discount', () => {
      const mockDate = new Date(2024, 6, 15); // July
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(5).fill('prod'), // 5 items = 10% volume discount
      });
      const products = Array(5).fill(createProduct({ price: 100, category: ProductCategoryEnum.Books }));

      order.calculateOrderValue(products, RegionEnum.US);

      // Total: 500
      // Seasonal discount (all Books): 500 * 0.15 = 75
      // Volume discount (5 items): 500 * 0.1 = 50
      // Max: 75
      // Price: 425
      expect(order.price).toBe(425);

      jest.restoreAllMocks();
    });
  });

  describe('calculateOrderValue - region combinations', () => {
    it('should handle all regions correctly', () => {
      const regions = [RegionEnum.US, RegionEnum.Europe, RegionEnum.Asia];
      const basePrice = 100;

      const results = regions.map((region) => {
        const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
        const products = [createProduct({ price: basePrice })];
        order.calculateOrderValue(products, region);
        return { region, price: order.price };
      });

      expect(results).toContainEqual({ region: RegionEnum.US, price: 100 });
      expect(results).toContainEqual({ region: RegionEnum.Europe, price: 115 });
      expect(results).toContainEqual({ region: RegionEnum.Asia, price: 95 });
    });

    it('should apply region markup to all products', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1', 'prod-2', 'prod-3'],
      });
      const products = [createProduct({ price: 50 }), createProduct({ price: 75 }), createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.Europe);

      // (50 + 75 + 100) * 1.15 = 225 * 1.15 = 258.75
      expect(order.price).toBe(258.75);
    });
  });

  describe('edge cases', () => {
    it('should handle empty product list', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: [] });
      const products: ProductModel[] = [];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(0);
    });

    it('should handle products with zero price', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      const products = [createProduct({ price: 0 })];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(0);
    });

    it('should handle products with decimal prices', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      const products = [createProduct({ price: 19.99 })];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBeCloseTo(19.99, 2);
    });

    it('should handle large quantities', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(100).fill('prod'),
      });
      const products = Array(100).fill(createProduct({ price: 100 }));

      order.calculateOrderValue(products, RegionEnum.US);

      // 100 items > 50, so 30% discount: 10000 - 3000 = 7000
      expect(order.price).toBe(7000);
    });

    it('should handle very high prices', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      const products = [createProduct({ price: 1000000 })];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(1000000);
    });

    it('should handle negative prices (if allowed)', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      const products = [createProduct({ price: -100 })];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(-100);
    });
  });

  describe('private helper methods behavior', () => {
    it('should calculate product price correctly for each region', () => {
      const regions = [
        { region: RegionEnum.US, multiplier: 1 },
        { region: RegionEnum.Europe, multiplier: 1.15 },
        { region: RegionEnum.Asia, multiplier: 0.95 },
      ];

      regions.forEach(({ region, multiplier }) => {
        const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
        const products = [createProduct({ price: 200 })];

        order.calculateOrderValue(products, region);

        expect(order.price).toBeCloseTo(200 * multiplier, 2);
      });
    });
  });

  describe('property assignments', () => {
    it('should allow setting id after construction', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      order.id = 'new-id';

      expect(order.id).toBe('new-id');
    });

    it('should allow setting price after construction', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      order.price = 999;

      expect(order.price).toBe(999);
    });

    it('should allow modifying customerId after construction', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      order.customerId = 'cust-2';

      expect(order.customerId).toBe('cust-2');
    });

    it('should allow modifying productIds after construction', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1'],
      });
      order.productIds = ['prod-2', 'prod-3'];

      expect(order.productIds).toEqual(['prod-2', 'prod-3']);
    });
  });
});
