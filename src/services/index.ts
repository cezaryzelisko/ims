export * from './commands';
export * from './events';
export * from './queries';
export * from './injection-tokens';

import { container } from 'tsyringe';
import { InjectionTokens } from '../services';
import { PostgresDB } from '../unit-of-work';
import {
  CommandBus,
  LoginCustomerCommand,
  LoginCustomerCommandHandler,
  RegisterCustomerCommand,
  RegisterCustomerCommandHandler,
} from './commands';

export async function initializeContainer(): Promise<void> {
  const db = new PostgresDB();
  await db.initialize();
  container.register(InjectionTokens.UnitOfWork, { useValue: db }).register(InjectionTokens.CommandBus, {
    useValue: new CommandBus()
      .register(LoginCustomerCommand.name, new LoginCustomerCommandHandler())
      .register(RegisterCustomerCommand.name, new RegisterCustomerCommandHandler()),
  });
}
