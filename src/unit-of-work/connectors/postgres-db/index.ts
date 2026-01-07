import { singleton } from 'tsyringe';
import { ICustomerRepository, IOrderRepository, IProductRepository, IUnitOfWork } from '../../interfaces';
import { DataSource, EntityManager } from 'typeorm';
import { logger } from '../../../utils';
import { exit } from 'process';
import dataSource from './data-source';
import { CustomerRepository, OrderRepository, ProductRepository } from './repositories';
import { CustomerEntity } from './entities/customer.entity';
import { ProductEntity } from './entities/product.entity';
import { OrderEntity } from './entities/order.entity';
import { RepositoryEnum, TransactionResultModel } from '../../models';

@singleton()
export class PostgresDB implements IUnitOfWork {
  readonly customerRepository: ICustomerRepository;
  readonly orderRepository: IOrderRepository;
  readonly productRepository: IProductRepository;
  private readonly dataSource: DataSource;

  constructor() {
    this.dataSource = dataSource;
    this.customerRepository = new CustomerRepository(CustomerEntity, this.dataSource.manager);
    this.orderRepository = new OrderRepository(OrderEntity, this.dataSource.manager);
    this.productRepository = new ProductRepository(ProductEntity, this.dataSource.manager);
  }

  async executeInTransaction<T>(
    fn: (getRepoFn: (repoKey: RepositoryEnum) => unknown) => Promise<T>,
  ): Promise<TransactionResultModel<T>> {
    try {
      return {
        result: await this.dataSource.transaction((entityManager) =>
          fn((repoKey) => this.getRepo(entityManager, repoKey)),
        ),
      };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async initialize(): Promise<void> {
    try {
      logger.info('Initializing DB connection...');
      await this.dataSource.initialize();
      logger.info('DB initialized successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if ('message' in error) {
        logger.error(`Unable to connect to the Postgres DB, exiting... (${error?.message})`);
      }

      exit(1);
    }
  }

  private getRepo(entityManager: EntityManager, repoKey: RepositoryEnum): unknown {
    switch (repoKey) {
      case RepositoryEnum.Customer: {
        return entityManager.withRepository(this.customerRepository as CustomerRepository);
      }
      case RepositoryEnum.Order: {
        return entityManager.withRepository(this.orderRepository as OrderRepository);
      }
      case RepositoryEnum.Product: {
        return entityManager.withRepository(this.productRepository as ProductRepository);
      }
    }
  }
}
