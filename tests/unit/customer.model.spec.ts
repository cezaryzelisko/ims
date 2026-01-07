import { CustomerModel, RegionEnum } from '../../src/domain';

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

      expect(customer.id).toBe(data.id);
      expect(customer.username).toBe(data.username);
      expect(customer.passwordHash).toBe(data.passwordHash);
      expect(customer.region).toBe(data.region);
    });

    it('should create a customer with partial properties', () => {
      const data = {
        username: 'jane_doe',
        region: RegionEnum.Europe,
      };

      const customer = new CustomerModel(data);

      expect(customer.username).toBe(data.username);
      expect(customer.region).toBe(data.region);
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

      expect(context).not.toBe(original);
      expect(context.id).toBe(original.id);
      expect(context.username).toBe(original.username);
      expect(context.region).toBe(original.region);
      expect(context.passwordHash).toBeUndefined();
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
});
