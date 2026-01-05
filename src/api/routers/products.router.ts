import { Router } from 'express';
import { container } from 'tsyringe';
import { GenericBus, GetAllProductsQuery, InjectionTokens } from '../../services';
import { PageModel, ProductModel } from '../../domain';
import { PageDto, PageOptionsDto, ProductDto } from '../dtos';

export const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  const pageOptions = new PageOptionsDto(req.query.limit?.toString(), req.query.page?.toString());
  const queryBus = container.resolve<GenericBus>(InjectionTokens.QueryBus);
  const productsPage = await queryBus.execute<GetAllProductsQuery, PageModel<ProductModel>>(
    new GetAllProductsQuery(req.id.toString(), PageOptionsDto.toDomain(pageOptions)),
  );

  return res.json(PageDto.fromDomain(productsPage, (product) => ProductDto.fromDomain(product)));
});
