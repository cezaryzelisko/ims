import { CustomerModel, RegionEnum } from '../../domain';

export class CustomerPayloadDto {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly region: RegionEnum,
  ) {}

  static fromDomain(customer: CustomerModel): Record<string, string> {
    return { id: customer.id!, username: customer.username, region: customer.region };
  }
}
