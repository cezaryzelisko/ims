export class CustomerModel {
  id?: string | undefined;
  username!: string;
  passwordHash?: string | undefined;

  constructor(data: Partial<CustomerModel>) {
    Object.assign(this, data);
  }

  toContextModel(): CustomerModel {
    return new CustomerModel({ id: this.id, username: this.username });
  }
}
