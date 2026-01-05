import { autoInjectable, inject } from 'tsyringe';
import { InjectionTokens, IOperationHandler } from '../../common';
import { GetAllProductsQuery } from './get-all-products.query';
import { DomainError, DomainErrorsEnum, PageModel, ProductModel } from '../../../domain';
import { logger } from '../../../utils';
import { IUnitOfWork } from '../../../unit-of-work';
import { pageOptionsSchema } from '../../../schemas';
import { ValidationError } from 'joi';

@autoInjectable()
export class GetAllProductsQueryHandler implements IOperationHandler<GetAllProductsQuery, PageModel<ProductModel>> {
  constructor(@inject(InjectionTokens.UnitOfWork) private readonly unitOfWork?: IUnitOfWork) {}

  async handle(query: GetAllProductsQuery): Promise<PageModel<ProductModel>> {
    logger.info(query.stringify());
    await this.validateInput(query);
    return this.unitOfWork!.productRepository.getAll(query.options);
  }

  private async validateInput(query: GetAllProductsQuery): Promise<void> {
    try {
      await pageOptionsSchema.validateAsync({ limit: query.options?.limit, offset: query.options?.offset });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new DomainError(error?.message, DomainErrorsEnum.ValidationError, error?.details);
      }
    }
  }
}
