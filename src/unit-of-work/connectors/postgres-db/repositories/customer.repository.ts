import { Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { ICustomerRepository } from '../../../interfaces';
import { CustomerModel } from '../../../../domain';

export class CustomerRepository extends Repository<CustomerEntity> implements ICustomerRepository {
  async getByUsername(username: string): Promise<CustomerModel | null> {
    const entity = await this.createQueryBuilder('customer').where('username = :username', { username }).getOne();
    return CustomerEntity.toDomain(entity);
  }

  async getById(id: string): Promise<CustomerModel | null> {
    const entity = await this.createQueryBuilder('customer').where('id = :id', { id }).getOne();
    return CustomerEntity.toDomain(entity);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return this.createQueryBuilder('customer').where('username = :username', { username }).getExists();
  }

  async persist(customer: CustomerModel): Promise<CustomerModel> {
    const entity = await this.save(CustomerEntity.fromDomain(customer));
    return CustomerEntity.toDomain(entity)!;
  }
}
