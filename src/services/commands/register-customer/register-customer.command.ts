import { RegionEnum } from '../../../domain';
import { ICommand } from '../interfaces';

export class RegisterCustomerCommand implements ICommand {
  constructor(
    readonly contextId: string,
    readonly username: string,
    readonly password: string,
    readonly region: RegionEnum,
  ) {}

  stringify(): string {
    return `[${RegisterCustomerCommand.name}: ${this.contextId}] registering new customer [username=${this.username}, region=${this.region}]`;
  }
}
