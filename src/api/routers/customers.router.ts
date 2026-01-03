import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import { container } from 'tsyringe';
import { InjectionTokens } from '../../services';
import { CommandBus } from '../../services/commands/command-bus';
import { RegisterCustomerCommand } from '../../services/commands/register-customer/register-customer.command';
import { CustomerModel } from '../../domain';

export const customersRouter = Router();

customersRouter.post('/login', async (req, res) => {
  res.json({ message: 'Login endpoint' });
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
