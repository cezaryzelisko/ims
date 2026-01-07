import { ProductModel, ProductCategoryEnum, OrderModel, RegionEnum } from '../../src/domain';

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
  const mockCurrentDate = (order: OrderModel, mockDate: Date): void => {
    jest.spyOn(order as unknown as { getCurrentDate: () => Date }, 'getCurrentDate').mockImplementation(() => mockDate);
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
      expect(order.customerId).toBeUndefined();
      expect(order.productIds).toBeUndefined();
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

      expect(order.price).toBeCloseTo(115);
    });

    it('should apply Asia region pricing (5% discount)', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      const products = [createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.Asia);

      expect(order.price).toBeCloseTo(95);
    });

    it('should handle multiple products with region markup', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1', 'prod-2'],
      });
      const products = [createProduct({ price: 100 }), createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.Europe);

      expect(order.price).toBeCloseTo(230); // (100 + 100) * 1.15
    });

    it('should handle multiple products with region discount', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1', 'prod-2'],
      });
      const products = [createProduct({ price: 100 }), createProduct({ price: 50 })];

      order.calculateOrderValue(products, RegionEnum.Asia);

      expect(order.price).toBeCloseTo(142.5); // (100 + 50) * 0.95
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
      const mockDate = new Date(2025, 6, 15); // July 15, 2025

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['book1', 'electronics1', 'clothes1', 'furniture1'],
      });
      mockCurrentDate(order, mockDate);
      const products = [
        createProduct({ price: 100, category: ProductCategoryEnum.Books }),
        createProduct({ price: 100, category: ProductCategoryEnum.Electronics }),
        createProduct({ price: 100, category: ProductCategoryEnum.Clothes }),
        createProduct({ price: 100, category: ProductCategoryEnum.Furnitures }),
      ];

      order.calculateOrderValue(products, RegionEnum.US);

      // Books and Electronics get 15% discount: (100 + 100) * 0.15 = 30
      // Total: 400, Discount: 30, Price: 370
      expect(order.price).toBe(370);

      jest.restoreAllMocks();
    });

    it('should detect holiday sales in August (month 7)', () => {
      const mockDate = new Date(2025, 7, 15); // August 15, 2025

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['book1', 'electronics1'],
      });
      mockCurrentDate(order, mockDate);
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
      const mockDate = new Date(2025, 6, 15); // July 15, 2025

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['clothes1', 'furniture1'],
      });
      mockCurrentDate(order, mockDate);
      const products = [
        createProduct({ price: 100, category: ProductCategoryEnum.Clothes }),
        createProduct({ price: 100, category: ProductCategoryEnum.Furnitures }),
      ];

      order.calculateOrderValue(products, RegionEnum.US);

      // No promotional items, no discount
      expect(order.price).toBe(200);

      jest.restoreAllMocks();
    });

    it('should not apply holiday discount outside holiday dates', () => {
      const mockDate = new Date(2025, 0, 15); // January 15, 2025

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['book1', 'furniture1'],
      });
      mockCurrentDate(order, mockDate);
      const products = [
        createProduct({ price: 100, category: ProductCategoryEnum.Books }),
        createProduct({ price: 100, category: ProductCategoryEnum.Furnitures }),
      ];

      order.calculateOrderValue(products, RegionEnum.US);

      // No holiday date, no discount
      expect(order.price).toBe(200);

      jest.restoreAllMocks();
    });
  });

  describe('calculateOrderValue - black friday', () => {
    it('should apply 25% discount on black friday', () => {
      // Black Friday is the last Friday of November
      const mockDate = new Date(2025, 10, 28); // Last Friday of November 2025

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1', 'prod-2'],
      });
      jest
        .spyOn(order as unknown as { getCurrentDate: () => Date }, 'getCurrentDate')
        .mockImplementation(() => mockDate);
      const products = [createProduct({ price: 100 }), createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.US);

      // 200 - (200 * 0.25) = 150
      expect(order.price).toBe(150);

      jest.restoreAllMocks();
    });

    it('should not apply black friday discount on non-black friday dates', () => {
      const mockDate = new Date(2025, 5, 22); // Not Black Friday

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1'],
      });
      mockCurrentDate(order, mockDate);
      const products = [createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(100);

      jest.restoreAllMocks();
    });
  });

  describe('calculateOrderValue - discount precedence', () => {
    it('should apply maximum discount when both seasonal and volume apply', () => {
      const mockDate = new Date(2025, 6, 15); // July - holiday season

      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(10).fill('prod'), // 10 items = 20% volume discount
      });
      mockCurrentDate(order, mockDate);
      const products = Array(10).fill(createProduct({ price: 100, category: ProductCategoryEnum.Books }));

      order.calculateOrderValue(products, RegionEnum.US);

      // Total: 1000
      // Seasonal discount (Books): 1000 * 0.15 = 150
      // Volume discount (10 items): 1000 * 0.2 = 200
      // Max discount: 200
      // Price: 800
      expect(order.price).toBe(800);

      jest.restoreAllMocks();
    });
  });

  describe('calculateOrderValue - region combinations', () => {
    it('should handle all regions correctly', () => {
      const regions = Object.values(RegionEnum);
      const basePrice = 100;
      const finalPrices: Record<RegionEnum, number> = {
        [RegionEnum.US]: 100,
        [RegionEnum.Europe]: 115,
        [RegionEnum.Asia]: 95,
      };

      for (const region of regions) {
        const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
        const products = [createProduct({ price: basePrice })];
        order.calculateOrderValue(products, region);

        expect(order.price).toBeCloseTo(finalPrices[region]);
      }
    });

    it('should apply region markup to all products', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: ['prod-1', 'prod-2', 'prod-3'],
      });
      const products = [createProduct({ price: 50 }), createProduct({ price: 75 }), createProduct({ price: 100 })];

      order.calculateOrderValue(products, RegionEnum.Europe);

      // (50 + 75 + 100) * 1.15 = 225 * 1.15 = 258.75
      expect(order.price).toBeCloseTo(258.75);
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

      expect(order.price).toBeCloseTo(19.99);
    });

    it('should handle large quantities', () => {
      const order = new OrderModel({
        customerId: 'cust-1',
        productIds: Array(100).fill('prod'),
      });
      const products = Array(100).fill(createProduct({ price: 100 }));

      order.calculateOrderValue(products, RegionEnum.US);

      // 100 items > 50, so 30% discount: 10000 - 3000 = 7000
      expect(order.price).toBe(7_000);
    });

    it('should handle very high prices', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: ['prod-1'] });
      const products = [createProduct({ price: 1_000_000 })];

      order.calculateOrderValue(products, RegionEnum.US);

      expect(order.price).toBe(1_000_000);
    });
  });

  describe('calculateOrderValue - discount and region based prices', () => {
    it('should handle volume based discount and europe markup', () => {
      const order = new OrderModel({ customerId: 'cust-1', productIds: Array(5).fill('prod') });
      const products = Array(5).fill(createProduct({ price: 100 }));

      order.calculateOrderValue(products, RegionEnum.Europe);

      // total (+ VAT): 500 * 1.15 = 575
      // volume based discount: 575 * 0.9 = 517.5
      expect(order.price).toBeCloseTo(517.5);
    });

    it('should handle Black Friday discount and asia discount', () => {
      // Black Friday is the last Friday of November
      const mockDate = new Date(2025, 10, 28); // Last Friday of November 2025
      const order = new OrderModel({ customerId: 'cust-1', productIds: Array(5).fill('prod') });
      mockCurrentDate(order, mockDate);
      const products = Array(5).fill(createProduct({ price: 100 }));

      order.calculateOrderValue(products, RegionEnum.Asia);

      // total (- discount): 500 * 0.95 = 475
      // black friday discount: 475 * 0.75 = 356.25
      expect(order.price).toBeCloseTo(356.25);

      jest.restoreAllMocks();
    });
  });
});
