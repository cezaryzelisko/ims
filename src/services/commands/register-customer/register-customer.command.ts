import { ICommand } from '../interfaces';

export class RegisterCustomerCommand implements ICommand {
  constructor(
    readonly contextId: string,
    readonly username: string,
    readonly password: string,
  ) {}

  stringify(): string {
    return `[${RegisterCustomerCommand.name}: ${this.contextId}] registering new customer: ${this.username}`;
  }
}
