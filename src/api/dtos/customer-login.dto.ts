import { CustomerModel } from '../../domain';

export class CustomerLoginDto {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly token: string,
  ) {}

  static fromDomain(customer: CustomerModel, token: string): CustomerLoginDto {
    return new CustomerLoginDto(customer.id!, customer.username, token);
  }
}
