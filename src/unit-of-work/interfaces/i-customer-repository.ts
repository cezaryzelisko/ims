import { CustomerModel } from '../../domain';

export interface ICustomerRepository {
  getByUsername(username: string): Promise<CustomerModel | null>;
  getById(id: string): Promise<CustomerModel | null>;
  existsByUsername(username: string): Promise<boolean>;
  persist(customer: CustomerModel): Promise<CustomerModel>;
}
