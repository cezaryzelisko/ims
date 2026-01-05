import { ICustomerRepository } from './i-customer-repository';
import { IProductRepository } from './i-product-repository';

export interface IUnitOfWork {
  readonly customerRepository: ICustomerRepository;
  readonly productRepository: IProductRepository;

  initialize?(): Promise<void>;
}
