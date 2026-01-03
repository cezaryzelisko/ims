import { ICommand } from '../interfaces';

export class LoginCustomerCommand implements ICommand {
  constructor(
    readonly contextId: string,
    readonly username: string,
    readonly password: string,
  ) {}

  stringify(): string {
    return `[${LoginCustomerCommand.name}: ${this.contextId}] logging in customer with [username=${this.username}]`;
  }
}
