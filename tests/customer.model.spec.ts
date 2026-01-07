import { CustomerModel, RegionEnum } from '../src/domain';

describe('CustomerModel', () => {
  describe('constructor', () => {
    it('should create a customer with all properties', () => {
      const data = {
        id: '123',
        username: 'john_doe',
        passwordHash: 'hashed_password',
        region: RegionEnum.US,
      };

      const customer = new CustomerModel(data);

      expect(customer.id).toBe('123');
      expect(customer.username).toBe('john_doe');
      expect(customer.passwordHash).toBe('hashed_password');
      expect(customer.region).toBe(RegionEnum.US);
    });

    it('should create a customer with partial properties', () => {
      const data = {
        username: 'jane_doe',
        region: RegionEnum.Europe,
      };

      const customer = new CustomerModel(data);

      expect(customer.username).toBe('jane_doe');
      expect(customer.region).toBe(RegionEnum.Europe);
      expect(customer.id).toBeUndefined();
      expect(customer.passwordHash).toBeUndefined();
    });

    it('should create an empty customer instance', () => {
      const customer = new CustomerModel({});

      expect(customer.id).toBeUndefined();
      expect(customer.username).toBeUndefined();
      expect(customer.passwordHash).toBeUndefined();
      expect(customer.region).toBeUndefined();
    });

    it('should allow updating properties via constructor', () => {
      const customer = new CustomerModel({
        id: '456',
        username: 'initial_user',
      });

      expect(customer.id).toBe('456');
      expect(customer.username).toBe('initial_user');
    });
  });

  describe('toContextModel', () => {
    it('should return a new instance with only id, username, and region', () => {
      const original = new CustomerModel({
        id: '123',
        username: 'john_doe',
        passwordHash: 'secret_hash',
        region: RegionEnum.Asia,
      });

      const context = original.toContextModel();

      expect(context.id).toBe('123');
      expect(context.username).toBe('john_doe');
      expect(context.region).toBe(RegionEnum.Asia);
      expect(context.passwordHash).toBeUndefined();
    });

    it('should return a new instance (not the same reference)', () => {
      const original = new CustomerModel({
        id: '123',
        username: 'john_doe',
        region: RegionEnum.US,
      });

      const context = original.toContextModel();

      expect(context).not.toBe(original);
      expect(context).toEqual(new CustomerModel({ id: '123', username: 'john_doe', region: RegionEnum.US }));
    });

    it('should handle undefined id and passwordHash', () => {
      const original = new CustomerModel({
        username: 'john_doe',
        region: RegionEnum.Europe,
      });

      const context = original.toContextModel();

      expect(context.id).toBeUndefined();
      expect(context.username).toBe('john_doe');
      expect(context.region).toBe(RegionEnum.Europe);
    });

    it('should exclude sensitive passwordHash field from context', () => {
      const original = new CustomerModel({
        id: '123',
        username: 'john_doe',
        passwordHash: 'very_sensitive_hash',
        region: RegionEnum.US,
      });

      const context = original.toContextModel();

      expect(context.passwordHash).toBeUndefined();
      expect(original.passwordHash).toBe('very_sensitive_hash');
    });
  });

  describe('property access', () => {
    it('should allow reading and writing id property', () => {
      const customer = new CustomerModel({});
      customer.id = 'new_id';

      expect(customer.id).toBe('new_id');
    });

    it('should allow reading and writing username property', () => {
      const customer = new CustomerModel({});
      customer.username = 'new_username';

      expect(customer.username).toBe('new_username');
    });

    it('should allow reading and writing region property', () => {
      const customer = new CustomerModel({});
      customer.region = RegionEnum.US;

      expect(customer.region).toBe(RegionEnum.US);
    });

    it('should allow reading and writing passwordHash property', () => {
      const customer = new CustomerModel({});
      customer.passwordHash = 'new_hash';

      expect(customer.passwordHash).toBe('new_hash');
    });
  });

  describe('edge cases', () => {
    it('should handle all region types', () => {
      const regions = [RegionEnum.US, RegionEnum.Europe, RegionEnum.Asia];

      regions.forEach((region) => {
        const customer = new CustomerModel({ region });
        expect(customer.region).toBe(region);
      });
    });

    it('should handle empty strings', () => {
      const customer = new CustomerModel({
        id: '',
        username: '',
        passwordHash: '',
        region: RegionEnum.US,
      });

      expect(customer.id).toBe('');
      expect(customer.username).toBe('');
      expect(customer.passwordHash).toBe('');
    });

    it('should handle special characters in username', () => {
      const specialUsername = 'user@#$%^&*()_+-=[]{}|;:,.<>?';
      const customer = new CustomerModel({ username: specialUsername });

      expect(customer.username).toBe(specialUsername);
    });
  });
});
