export * from './commands';
export * from './events';
export * from './queries';
export * from './injection-tokens';

import { container } from 'tsyringe';
import { InjectionTokens } from '../services';
import { InMemoryDB } from '../unit-of-work';
import { CommandBus } from './commands/command-bus';
import { RegisterCustomerCommand } from './commands/register-customer/register-customer.command';
import { RegisterCustomerCommandHandler } from './commands/register-customer/register-customer.command-handler';

container.register(InjectionTokens.UnitOfWork, { useClass: InMemoryDB }).register(InjectionTokens.CommandBus, {
  useValue: new CommandBus().register(RegisterCustomerCommand.name, new RegisterCustomerCommandHandler()),
});
