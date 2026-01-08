import { PageOptionsModel, PageModel } from '../../src/domain';

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

      expect(page.options.limit).toBe(20);
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
      const page = new PageModel([1], 1_000_000, new PageOptionsModel(10_000, 0));

      expect(page.pagesCount).toBe(50_000);
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
  });

  describe('edge cases', () => {
    it('should handle page with single item', () => {
      const count = 1;
      const data = [42];
      const page = new PageModel(data, count);

      expect(page.data).toEqual([42]);
      expect(page.count).toBe(count);
      expect(page.pagesCount).toBe(1);
    });

    it('should handle very large data arrays', () => {
      const count = 10_000;
      const largeArray = Array.from({ length: count }, (_, i) => ({ id: i }));
      const page = new PageModel(largeArray, count, new PageOptionsModel(100, 0));

      expect(page.data.length).toBe(10_000);
      expect(page.pagesCount).toBe(500);
    });

    it('should handle complex nested objects', () => {
      const complexData = [
        { id: 1, nested: { value: 'a' }, array: [1, 2, 3] },
        { id: 2, nested: { value: 'b' }, array: [4, 5, 6] },
      ];
      const page = new PageModel(complexData, 100);

      expect(page.data).toEqual(complexData);
    });

    it('should handle limit of zero by assigning the default limit', () => {
      const page = new PageModel([1, 2, 3], 100, new PageOptionsModel(0, 0));

      expect(page.pagesCount).toBe(10);
    });
  });
});
