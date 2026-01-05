import { RegionEnum } from './region.enum';

export class CustomerModel {
  id?: string | undefined;
  username!: string;
  passwordHash?: string | undefined;
  region!: RegionEnum;

  constructor(data: Partial<CustomerModel>) {
    Object.assign(this, data);
  }

  toContextModel(): CustomerModel {
    return new CustomerModel({ id: this.id, username: this.username });
  }
}
