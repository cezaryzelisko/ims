export * from './commands';
export * from './events';
export * from './queries';
export * from './common';

import { container } from 'tsyringe';
import { InjectionTokens } from '../services';
import { PostgresDB } from '../unit-of-work';
import {
  CreateProductCommand,
  CreateProductCommandHandler,
  LoginCustomerCommand,
  LoginCustomerCommandHandler,
  RegisterCustomerCommand,
  RegisterCustomerCommandHandler,
  RestockProductCommand,
  RestockProductCommandHandler,
  SellProductCommand,
  SellProductCommandHandler,
} from './commands';
import { GenericBus } from './common';
import { GetAllProductsQuery, GetAllProductsQueryHandler } from './queries';

export async function initializeContainer(): Promise<void> {
  const db = new PostgresDB();
  await db.initialize();
  container
    .register(InjectionTokens.UnitOfWork, { useValue: db })
    .register(InjectionTokens.CommandBus, {
      useValue: new GenericBus()
        .register(CreateProductCommand.name, new CreateProductCommandHandler())
        .register(LoginCustomerCommand.name, new LoginCustomerCommandHandler())
        .register(RegisterCustomerCommand.name, new RegisterCustomerCommandHandler())
        .register(RestockProductCommand.name, new RestockProductCommandHandler())
        .register(SellProductCommand.name, new SellProductCommandHandler()),
    })
    .register(InjectionTokens.QueryBus, {
      useValue: new GenericBus().register(GetAllProductsQuery.name, new GetAllProductsQueryHandler()),
    });
}
