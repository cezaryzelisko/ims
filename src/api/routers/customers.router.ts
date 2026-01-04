import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import { container } from 'tsyringe';
import { CommandBus, InjectionTokens, RegisterCustomerCommand } from '../../services';
import { CustomerModel } from '../../domain';
import { localAuth, signCustomer } from '../utils';
import { CustomerDto } from '../dtos';

export const customersRouter = Router();

customersRouter.post('/login', localAuth, async (req, res) => {
  res.status(HttpStatus.CREATED).json(signCustomer(req.user as CustomerModel));
});

customersRouter.post('/registration', async (req, res) => {
  const commandBus = container.resolve<CommandBus>(InjectionTokens.CommandBus);
  const customer = await commandBus.execute<RegisterCustomerCommand, CustomerModel>(
    new RegisterCustomerCommand(req.id.toString(), req.body.username, req.body.password),
  );

  if (!customer) {
    return res.status(HttpStatus.CONFLICT).json({ message: 'Customer with the given username already exists' });
  }

  res.status(HttpStatus.CREATED).json(CustomerDto.fromDomain(customer));
});
