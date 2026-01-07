import { Router } from 'express';
import { jwtAuth } from '../utils';
import { container } from 'tsyringe';
import { GenericBus, InjectionTokens, OrderProductsCommand } from '../../services';
import { OrderModel } from '../../domain';
import { CustomerPayloadDto, OrderDto } from '../dtos';
import HttpStatus from 'http-status-codes';

export const ordersRouter = Router();

ordersRouter.post('/', jwtAuth, async (req, res) => {
  const userContext = req.user as CustomerPayloadDto;
  const commandBus = container.resolve<GenericBus>(InjectionTokens.CommandBus);
  const order = await commandBus.execute<OrderProductsCommand, OrderModel>(
    new OrderProductsCommand(req.id.toString(), userContext.id, userContext.region, req.body.productIds),
  );

  return res.status(HttpStatus.OK).json(OrderDto.fromDomain(order));
});
