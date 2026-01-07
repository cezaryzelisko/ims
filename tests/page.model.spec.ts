import { PageOptionsModel, PageModel } from '../src/domain';

describe('PageModel', () => {
  describe('constructor', () => {
    it('should create page with data, count, and options', () => {
      const count = 100;
      const data = [1, 2, 3];
      const options = new PageOptionsModel(10, 0);
      const page = new PageModel(data, count, options);

      expect(page.data).toEqual(data);
      expect(page.count).toBe(count);
      expect(page.options).toBe(options);
    });

    it('should create page with data and count only', () => {
      const count = 100;
      const data = [1, 2, 3];
      const page = new PageModel(data, count);

      expect(page.data).toEqual(data);
      expect(page.count).toBe(count);
      expect(page.options).toBeDefined();
      expect(page.options.limit).toBe(10);
      expect(page.options.offset).toBe(0);
    });

    it('should create empty page', () => {
      const count = 0;
      const data: number[] = [];
      const page = new PageModel(data, count);

      expect(page.data).toEqual(data);
      expect(page.count).toBe(count);
    });
  });

  describe('count property', () => {
    it('should handle zero count', () => {
      const count = 0;
      const page = new PageModel([], count);

      expect(page.count).toBe(count);
    });

    it('should handle count larger than data length', () => {
      const data = [1, 2];
      const count = data.length + 1;
      const page = new PageModel(data, count);

      expect(page.data.length).toBe(data.length);
      expect(page.count).toBe(count);
    });
  });

  describe('options property', () => {
    it('should use default options when not provided', () => {
      const page = new PageModel([1, 2], 50);

      expect(page.options.limit).toBe(10);
      expect(page.options.offset).toBe(0);
    });

    it('should handle custom options', () => {
      const customOptions = new PageOptionsModel(50, 100);
      const page = new PageModel([1, 2], 500, customOptions);

      expect(page.options.limit).toBe(50);
      expect(page.options.offset).toBe(100);
    });
  });

  describe('pagesCount getter', () => {
    it('should calculate correct pages count with exact division', () => {
      const page = new PageModel([1, 2, 3], 30, new PageOptionsModel(10, 0));

      expect(page.pagesCount).toBe(3);
    });

    it('should calculate correct pages count with remainder', () => {
      const page = new PageModel([1, 2, 3], 25, new PageOptionsModel(10, 0));

      expect(page.pagesCount).toBe(3);
    });

    it('should calculate pages count for single page', () => {
      const page = new PageModel([1, 2], 5, new PageOptionsModel(10, 0));

      expect(page.pagesCount).toBe(1);
    });

    it('should handle zero count', () => {
      const page = new PageModel([], 0, new PageOptionsModel(10, 0));

      expect(page.pagesCount).toBe(0);
    });

    it('should handle large count with small limit', () => {
      const page = new PageModel([1], 1000, new PageOptionsModel(1, 0));

      expect(page.pagesCount).toBe(1000);
    });

    it('should handle large count with large limit', () => {
      const page = new PageModel([1], 1000000, new PageOptionsModel(10000, 0));

      expect(page.pagesCount).toBe(100);
    });

    it('should round up pages count correctly', () => {
      const page1 = new PageModel([1], 21, new PageOptionsModel(10, 0));
      const page2 = new PageModel([1], 20, new PageOptionsModel(10, 0));
      const page3 = new PageModel([1], 19, new PageOptionsModel(10, 0));

      expect(page1.pagesCount).toBe(3);
      expect(page2.pagesCount).toBe(2);
      expect(page3.pagesCount).toBe(2);
    });

    it('should handle count of 1 with limit of 1', () => {
      const page = new PageModel([1], 1, new PageOptionsModel(1, 0));

      expect(page.pagesCount).toBe(1);
    });

    it('should handle fractional results by rounding up', () => {
      const page = new PageModel([1, 2], 33, new PageOptionsModel(10, 0));

      expect(page.pagesCount).toBe(4);
    });
  });

  describe('multiple instances', () => {
    it('should maintain independence between instances', () => {
      const page1 = new PageModel([1, 2, 3], 30, new PageOptionsModel(10, 0));
      const page2 = new PageModel(['a', 'b'], 50, new PageOptionsModel(20, 10));

      expect(page1.data).toEqual([1, 2, 3]);
      expect(page1.count).toBe(30);
      expect(page1.pagesCount).toBe(3);

      expect(page2.data).toEqual(['a', 'b']);
      expect(page2.count).toBe(50);
      expect(page2.pagesCount).toBe(3);
    });

    it('should handle same data but different pagination', () => {
      const data = [1, 2, 3, 4, 5];
      const page1 = new PageModel(data, 100, new PageOptionsModel(10, 0));
      const page2 = new PageModel(data, 100, new PageOptionsModel(25, 0));

      expect(page1.pagesCount).toBe(10);
      expect(page2.pagesCount).toBe(4);
    });
  });

  describe('edge cases', () => {
    it('should handle page with single item', () => {
      const page = new PageModel([42], 1);

      expect(page.data).toEqual([42]);
      expect(page.count).toBe(1);
      expect(page.pagesCount).toBe(1);
    });

    it('should handle very large data arrays', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i }));
      const page = new PageModel(largeArray, 10000, new PageOptionsModel(100, 0));

      expect(page.data.length).toBe(10000);
      expect(page.pagesCount).toBe(100);
    });

    it('should handle complex nested objects', () => {
      const complexData = [
        { id: 1, nested: { value: 'a' }, array: [1, 2, 3] },
        { id: 2, nested: { value: 'b' }, array: [4, 5, 6] },
      ];
      const page = new PageModel(complexData, 100);

      expect(page.data).toEqual(complexData);
      expect(page.data[0].nested.value).toBe('a');
    });

    it('should handle limit of zero', () => {
      const page = new PageModel([1, 2, 3], 100, new PageOptionsModel(0, 0));

      // This would cause division by zero, potentially resulting in Infinity
      expect(page.pagesCount).toBe(Infinity);
    });

    it('should handle decimal limit and count', () => {
      const page = new PageModel([1, 2], 25.5, new PageOptionsModel(10.5, 0));

      expect(page.pagesCount).toBe(3);
    });

    it('should handle null values in data array', () => {
      const page = new PageModel([1, null, 3] as (number | null)[], 3);

      expect(page.data).toEqual([1, null, 3]);
      expect(page.data[1]).toBeNull();
    });
  });

  describe('getters readonly behavior', () => {
    it('should have readonly data', () => {
      const page = new PageModel([1, 2, 3], 10);

      expect(() => {
        (page as any).data = [4, 5, 6];
      }).not.toThrow(); // Assignment doesn't throw in non-strict mode but doesn't change value

      // Verify data hasn't changed
      expect(page.data).toEqual([1, 2, 3]);
    });

    it('should have readonly count', () => {
      const page = new PageModel([1, 2, 3], 10);

      expect(() => {
        (page as any).count = 100;
      }).not.toThrow();

      expect(page.count).toBe(10);
    });

    it('should have readonly options', () => {
      const options = new PageOptionsModel(10, 0);
      const page = new PageModel([1, 2], 10, options);

      expect(() => {
        (page as any).options = new PageOptionsModel(20, 5);
      }).not.toThrow();

      expect(page.options).toBe(options);
    });
  });
});
