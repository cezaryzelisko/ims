import { CustomerModel, RegionEnum } from '../../domain';

export class CustomerDto {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly region: RegionEnum,
  ) {}

  static fromDomain(customer: CustomerModel): CustomerDto {
    return new CustomerDto(customer.id!, customer.username, customer.region);
  }
}
