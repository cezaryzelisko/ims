import { singleton } from 'tsyringe';
import { ICustomerRepository, IOrderRepository, IProductRepository, IUnitOfWork } from '../../interfaces';
import { CustomerRepository } from './customer.repository';
import { ProductRepository } from './product.repository';
import { OrderRepository } from './order.repository';
import { RepositoryEnum, TransactionResultModel } from '../../models';

@singleton()
export class InMemoryDB implements IUnitOfWork {
  readonly customerRepository: ICustomerRepository;
  readonly orderRepository: IOrderRepository;
  readonly productRepository: IProductRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
  }

  async executeInTransaction<T>(
    fn: (getRepoFn: (repoKey: RepositoryEnum) => unknown) => Promise<T>,
  ): Promise<TransactionResultModel<T>> {
    try {
      return { result: await fn((repoKey) => this.getRepo(repoKey)) };
    } catch (error) {
      return { error: error as Error };
    }
  }

  private getRepo(repoKey: RepositoryEnum): unknown {
    switch (repoKey) {
      case RepositoryEnum.Customer: {
        return this.customerRepository;
      }
      case RepositoryEnum.Order: {
        return this.orderRepository;
      }
      case RepositoryEnum.Product: {
        return this.productRepository;
      }
    }
  }
}
