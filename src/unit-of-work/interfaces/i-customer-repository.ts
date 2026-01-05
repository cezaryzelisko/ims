import { CustomerModel } from '../../domain';

export interface ICustomerRepository {
  findByUsername(username: string): Promise<CustomerModel | null>;
  findById(id: string): Promise<CustomerModel | null>;
  existsByUsername(username: string): Promise<boolean>;
  persist(customer: CustomerModel): Promise<CustomerModel>;
}
