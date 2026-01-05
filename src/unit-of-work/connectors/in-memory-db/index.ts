import { singleton } from 'tsyringe';
import { ICustomerRepository, IProductRepository, IUnitOfWork } from '../../interfaces';
import { CustomerRepository } from './customer.repository';
import { ProductRepository } from './product.repository';

@singleton()
export class InMemoryDB implements IUnitOfWork {
  readonly customerRepository: ICustomerRepository;
  readonly productRepository: IProductRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
    this.productRepository = new ProductRepository();
  }
}
