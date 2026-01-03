import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import { container } from 'tsyringe';
import { CommandBus, InjectionTokens, LoginCustomerCommand, RegisterCustomerCommand } from '../../services';
import { CustomerModel } from '../../domain';

export const customersRouter = Router();

customersRouter.post('/login', async (req, res) => {
  // TODO: use local strategy instead of direct command bus call and return JWT token
  const commandBus = container.resolve<CommandBus>(InjectionTokens.CommandBus);
  const customer = await commandBus.execute<LoginCustomerCommand, CustomerModel | null>(
    new LoginCustomerCommand(req.id.toString(), req.body.username, req.body.password),
  );

  if (!customer) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid username or password' });
  }

  res.status(HttpStatus.CREATED).json({ message: `Customer logged in with [id=${customer.id}]` });
});

customersRouter.post('/registration', async (req, res) => {
  const commandBus = container.resolve<CommandBus>(InjectionTokens.CommandBus);
  const customer = await commandBus.execute<RegisterCustomerCommand, CustomerModel>(
    new RegisterCustomerCommand(req.id.toString(), req.body.username, req.body.password),
  );

  if (!customer) {
    return res.status(HttpStatus.CONFLICT).json({ message: 'Customer with the given username already exists' });
  }

  res.status(HttpStatus.CREATED).json({ message: `New customer registered with [id=${customer?.id}]` });
});
