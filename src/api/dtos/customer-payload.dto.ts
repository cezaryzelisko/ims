import { CustomerModel } from '../../domain';

export class CustomerPayloadDto {
  constructor(
    readonly id: string,
    readonly username: string,
  ) {}

  static fromDomain(customer: CustomerModel): Record<string, string> {
    return { id: customer.id!, username: customer.username };
  }
}
