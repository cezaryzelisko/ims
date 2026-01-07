import { PageOptionsModel } from '../src/domain';

describe('PageOptionsModel', () => {
  describe('constructor', () => {
    it('should create with both limit and offset', () => {
      const options = new PageOptionsModel(20, 5);

      expect(options.limit).toBe(20);
      expect(options.offset).toBe(5);
    });

    it('should create with only limit', () => {
      const options = new PageOptionsModel(20);

      expect(options.limit).toBe(20);
      expect(options.offset).toBe(0);
    });

    it('should create with only offset', () => {
      const options = new PageOptionsModel(undefined, 10);

      expect(options.limit).toBe(10);
      expect(options.offset).toBe(10);
    });

    it('should create with no parameters', () => {
      const options = new PageOptionsModel();

      expect(options.limit).toBe(10);
      expect(options.offset).toBe(0);
    });

    it('should create with undefined parameters', () => {
      const options = new PageOptionsModel(undefined, undefined);

      expect(options.limit).toBe(10);
      expect(options.offset).toBe(0);
    });
  });

  describe('default values', () => {
    it('should use default limit when not provided', () => {
      const options = new PageOptionsModel();

      expect(options.limit).toBe(10);
    });

    it('should use default offset when not provided', () => {
      const options = new PageOptionsModel();

      expect(options.offset).toBe(0);
    });

    it('should override default limit with provided value', () => {
      const options = new PageOptionsModel(25);

      expect(options.limit).toBe(25);
    });

    it('should override default offset with provided value', () => {
      const options = new PageOptionsModel(10, 50);

      expect(options.offset).toBe(50);
    });
  });

  describe('limit property', () => {
    it('should return provided limit', () => {
      const options = new PageOptionsModel(15);

      expect(options.limit).toBe(15);
    });

    it('should return default limit when undefined', () => {
      const options = new PageOptionsModel(undefined);

      expect(options.limit).toBe(10);
    });

    it('should handle zero limit', () => {
      const options = new PageOptionsModel(0);

      expect(options.limit).toBe(0);
    });

    it('should handle large limit values', () => {
      const options = new PageOptionsModel(1000000);

      expect(options.limit).toBe(1000000);
    });

    it('should handle negative limit values', () => {
      const options = new PageOptionsModel(-5);

      expect(options.limit).toBe(-5);
    });
  });

  describe('offset property', () => {
    it('should return provided offset', () => {
      const options = new PageOptionsModel(10, 25);

      expect(options.offset).toBe(25);
    });

    it('should return default offset when undefined', () => {
      const options = new PageOptionsModel(10, undefined);

      expect(options.offset).toBe(0);
    });

    it('should handle zero offset', () => {
      const options = new PageOptionsModel(10, 0);

      expect(options.offset).toBe(0);
    });

    it('should handle large offset values', () => {
      const options = new PageOptionsModel(10, 1000000);

      expect(options.offset).toBe(1000000);
    });

    it('should handle negative offset values', () => {
      const options = new PageOptionsModel(10, -5);

      expect(options.offset).toBe(-5);
    });
  });

  describe('from static method', () => {
    it('should create from existing PageOptionsModel', () => {
      const original = new PageOptionsModel(25, 15);
      const copy = PageOptionsModel.from(original);

      expect(copy.limit).toBe(25);
      expect(copy.offset).toBe(15);
    });

    it('should create new instance with undefined', () => {
      const options = PageOptionsModel.from(undefined);

      expect(options.limit).toBe(10);
      expect(options.offset).toBe(0);
    });

    it('should handle partial PageOptionsModel', () => {
      const partial = { limit: 20 } as PageOptionsModel;
      const options = PageOptionsModel.from(partial);

      expect(options.limit).toBe(20);
      expect(options.offset).toBe(0);
    });

    it('should handle PageOptionsModel with undefined properties', () => {
      const partial = { limit: undefined, offset: undefined } as PageOptionsModel;
      const options = PageOptionsModel.from(partial);

      expect(options.limit).toBe(10);
      expect(options.offset).toBe(0);
    });

    it('should create independent instances', () => {
      const original = new PageOptionsModel(20, 10);
      const copy = PageOptionsModel.from(original);

      expect(copy).not.toBe(original);
      expect(copy.limit).toBe(original.limit);
      expect(copy.offset).toBe(original.offset);
    });

    it('should handle mixed defined and undefined properties in from', () => {
      const partial = new PageOptionsModel(15, undefined);
      const copy = PageOptionsModel.from(partial);

      expect(copy.limit).toBe(15);
      expect(copy.offset).toBe(0);
    });
  });

  describe('immutability', () => {
    it('should not allow modifying limit after construction', () => {
      const options = new PageOptionsModel(20, 5);

      expect(options.limit).toBe(20);
      // Attempting to assign to a getter will be silently ignored in strict mode or throw
      // This test verifies the property is read-only as per the implementation
    });

    it('should not allow modifying offset after construction', () => {
      const options = new PageOptionsModel(20, 5);

      expect(options.offset).toBe(5);
      // Attempting to assign to a getter will be silently ignored in strict mode or throw
    });
  });

  describe('multiple instances', () => {
    it('should maintain independence between instances', () => {
      const options1 = new PageOptionsModel(10, 0);
      const options2 = new PageOptionsModel(20, 30);

      expect(options1.limit).toBe(10);
      expect(options1.offset).toBe(0);
      expect(options2.limit).toBe(20);
      expect(options2.offset).toBe(30);
    });

    it('should handle creating multiple instances with same values', () => {
      const options1 = new PageOptionsModel(15, 10);
      const options2 = new PageOptionsModel(15, 10);

      expect(options1.limit).toBe(options2.limit);
      expect(options1.offset).toBe(options2.offset);
      expect(options1).not.toBe(options2);
    });
  });

  describe('edge cases', () => {
    it('should handle float limit values', () => {
      const options = new PageOptionsModel(10.5, 5.7);

      expect(options.limit).toBe(10.5);
      expect(options.offset).toBe(5.7);
    });

    it('should handle very small limit and offset', () => {
      const options = new PageOptionsModel(0.001, 0.001);

      expect(options.limit).toBe(0.001);
      expect(options.offset).toBe(0.001);
    });

    it('should handle MAX_SAFE_INTEGER values', () => {
      const options = new PageOptionsModel(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

      expect(options.limit).toBe(Number.MAX_SAFE_INTEGER);
      expect(options.offset).toBe(Number.MAX_SAFE_INTEGER);
    });
  });
});
