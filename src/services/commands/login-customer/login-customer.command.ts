import { IOperation } from '../../common';

export class LoginCustomerCommand implements IOperation {
  constructor(
    readonly contextId: string,
    readonly username: string,
    readonly password: string,
  ) {}

  stringify(): string {
    return `[${LoginCustomerCommand.name}: ${this.contextId}] logging in customer with [username=${this.username}]`;
  }
}
