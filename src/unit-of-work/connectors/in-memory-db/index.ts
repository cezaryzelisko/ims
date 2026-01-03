import { singleton } from 'tsyringe';
import { ICustomerRepository, IUnitOfWork } from '../../interfaces';
import { CustomerRepository } from './customer.repository';

@singleton()
export class InMemoryDB implements IUnitOfWork {
  readonly customerRepository: ICustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }
}
