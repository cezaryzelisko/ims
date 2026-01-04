import { CustomerModel } from '../../domain';

export class CustomerDto {
  constructor(
    readonly id: string,
    readonly username: string,
  ) {}

  static fromDomain(customer: CustomerModel): CustomerDto {
    return new CustomerDto(customer.id!, customer.username);
  }
}
