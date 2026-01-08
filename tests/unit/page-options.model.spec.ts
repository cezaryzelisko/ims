import { PageOptionsModel } from '../../src/domain';

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
      const options = new PageOptionsModel(15);

      expect(options.limit).toBe(15);
    });

    it('should override default offset with provided value', () => {
      const options = new PageOptionsModel(10, 50);

      expect(options.offset).toBe(50);
    });
  });

  describe('limit property', () => {
    it('should handle zero limit and assign the default value', () => {
      const options = new PageOptionsModel(0);

      expect(options.limit).toBe(10);
    });

    it('should handle scenario when provided limit is greater than the maximum value', () => {
      const options = new PageOptionsModel(100);

      expect(options.limit).toBe(20);
    });
  });

  describe('offset property', () => {
    it('should handle zero offset', () => {
      const options = new PageOptionsModel(10, 0);

      expect(options.offset).toBe(0);
    });
  });

  describe('from static method', () => {
    it('should create from existing PageOptionsModel', () => {
      const original = new PageOptionsModel(15, 10);
      const copy = PageOptionsModel.from(original);

      expect(copy.limit).toBe(15);
      expect(copy.offset).toBe(10);
    });

    it('should create new instance with no parameters', () => {
      const options = PageOptionsModel.from();

      expect(options.limit).toBe(10);
      expect(options.offset).toBe(0);
    });

    it('should handle partial PageOptionsModel', () => {
      const partial = new PageOptionsModel(20);
      const options = PageOptionsModel.from(partial);

      expect(options.limit).toBe(20);
      expect(options.offset).toBe(0);
    });

    it('should handle PageOptionsModel with no properties', () => {
      const partial = new PageOptionsModel();
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
  });
});
