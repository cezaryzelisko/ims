import { Router } from 'express';
import { container } from 'tsyringe';
import {
  CreateProductCommand,
  GenericBus,
  GetAllProductsQuery,
  InjectionTokens,
  RestockProductCommand,
  SellProductCommand,
} from '../../services';
import { PageModel, ProductModel } from '../../domain';
import { PageDto, PageOptionsDto, ProductDto } from '../dtos';
import HttpStatus from 'http-status-codes';

export const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  const pageOptions = new PageOptionsDto(req.query.limit?.toString(), req.query.page?.toString());
  const queryBus = container.resolve<GenericBus>(InjectionTokens.QueryBus);
  const productsPage = await queryBus.execute<GetAllProductsQuery, PageModel<ProductModel>>(
    new GetAllProductsQuery(req.id.toString(), PageOptionsDto.toDomain(pageOptions)),
  );

  return res.json(PageDto.fromDomain(productsPage, (product) => ProductDto.fromDomain(product)));
});

productsRouter.post('/', async (req, res) => {
  const commandBus = container.resolve<GenericBus>(InjectionTokens.CommandBus);
  let product = new ProductModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
  });
  product = await commandBus.execute<CreateProductCommand, ProductModel>(
    new CreateProductCommand(req.id.toString(), product),
  );

  return res.status(HttpStatus.OK).json(ProductDto.fromDomain(product));
});

productsRouter.post('/:id/restock', async (req, res) => {
  const commandBus = container.resolve<GenericBus>(InjectionTokens.CommandBus);
  const product = await commandBus.execute<RestockProductCommand, ProductModel>(
    new RestockProductCommand(req.id.toString(), req.params.id, req.body.count),
  );

  return res.status(HttpStatus.CREATED).json(ProductDto.fromDomain(product));
});

productsRouter.post('/:id/sell', async (req, res) => {
  const commandBus = container.resolve<GenericBus>(InjectionTokens.CommandBus);
  const product = await commandBus.execute<SellProductCommand, ProductModel>(
    new SellProductCommand(req.id.toString(), req.params.id, req.body.count),
  );

  return res.status(HttpStatus.CREATED).json(ProductDto.fromDomain(product));
});
