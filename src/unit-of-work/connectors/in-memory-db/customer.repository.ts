import uuid from 'uuid';
import { CustomerModel } from '../../../domain';
import { ICustomerRepository } from '../../interfaces';
import { InMemoryRepository } from './in-memory.repository';

export class CustomerRepository extends InMemoryRepository<CustomerModel> implements ICustomerRepository {
  async findByUsername(username: string): Promise<CustomerModel | null> {
    return Object.values(this.items).find((customer) => customer.username === username) || null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    return !!(await this.findByUsername(username));
  }

  async create(customer: CustomerModel): Promise<CustomerModel> {
    customer.id = uuid.v4();
    this.items[customer.id] = customer;

    return customer;
  }
}
