import { singleton } from 'tsyringe';
import { ICustomerRepository, IUnitOfWork } from '../../interfaces';

@singleton()
export class PostgresDB implements IUnitOfWork {
  readonly customerRepository: ICustomerRepository;

  constructor() {
    this.customerRepository = {} as ICustomerRepository;
  }

  async initialize(): Promise<void> {}
}
