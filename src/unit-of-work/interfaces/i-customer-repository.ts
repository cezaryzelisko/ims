import { CustomerModel } from '../../domain';

export interface ICustomerRepository {
  findByUsername(username: string): Promise<CustomerModel | null>;
  existsByUsername(username: string): Promise<boolean>;
  create(customer: CustomerModel): Promise<CustomerModel>;
}
