import { ICustomerRepository } from './i-customer-repository';
import { IOrderRepository } from './i-order-repository';
import { IProductRepository } from './i-product-repository';
import { RepositoryEnum, TransactionResultModel } from '../models';

export interface IUnitOfWork {
  readonly customerRepository: ICustomerRepository;
  readonly orderRepository: IOrderRepository;
  readonly productRepository: IProductRepository;

  executeInTransaction<T>(
    fn: (getRepoFn: (repoKey: RepositoryEnum) => unknown) => Promise<T>,
  ): Promise<TransactionResultModel<T>>;
  initialize?(): Promise<void>;
}
