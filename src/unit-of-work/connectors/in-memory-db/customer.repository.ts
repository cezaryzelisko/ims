import { CustomerModel } from '../../../domain';
import { ICustomerRepository } from '../../interfaces';
import { InMemoryRepository } from './in-memory.repository';

export class CustomerRepository extends InMemoryRepository<CustomerModel> implements ICustomerRepository {
  async getByUsername(username: string): Promise<CustomerModel | null> {
    return Object.values(this.items).find((customer) => customer.username === username) || null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    return !!(await this.getByUsername(username));
  }
}
