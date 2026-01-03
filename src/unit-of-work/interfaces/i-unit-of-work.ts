import { ICustomerRepository } from './i-customer-repository';

export interface IUnitOfWork {
  readonly customerRepository: ICustomerRepository;

  initialize?(): Promise<void>;
}
