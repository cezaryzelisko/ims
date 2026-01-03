export * from './commands';
export * from './events';
export * from './queries';
export * from './injection-tokens';

import { container } from 'tsyringe';
import { InjectionTokens } from '../services';
import { InMemoryDB } from '../unit-of-work';
import {
  CommandBus,
  LoginCustomerCommand,
  LoginCustomerCommandHandler,
  RegisterCustomerCommand,
  RegisterCustomerCommandHandler,
} from './commands';

container.register(InjectionTokens.UnitOfWork, { useValue: new InMemoryDB() }).register(InjectionTokens.CommandBus, {
  useValue: new CommandBus()
    .register(LoginCustomerCommand.name, new LoginCustomerCommandHandler())
    .register(RegisterCustomerCommand.name, new RegisterCustomerCommandHandler()),
});
