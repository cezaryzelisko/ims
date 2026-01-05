import { singleton } from 'tsyringe';
import { ICustomerRepository, IUnitOfWork } from '../../interfaces';
import { DataSource } from 'typeorm';
import { logger } from '../../../utils';
import { exit } from 'process';
import dataSource from './data-source';
import { CustomerRepository } from './repositories';
import { CustomerEntity } from './entities/customer.entity';

@singleton()
export class PostgresDB implements IUnitOfWork {
  readonly customerRepository: ICustomerRepository;
  private readonly dataSource: DataSource;

  constructor() {
    this.dataSource = dataSource;
    this.customerRepository = new CustomerRepository(CustomerEntity, this.dataSource.manager);
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
}
