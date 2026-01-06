import { autoInjectable, inject } from 'tsyringe';
import { InjectionTokens, IOperationHandler } from '../../common';
import { RestockProductCommand } from './restock-product.command';
import { DomainError, DomainErrorsEnum, ProductModel } from '../../../domain';
import { IUnitOfWork } from '../../../unit-of-work';
import { logger } from '../../../utils';
import { productStockSchema } from '../../../schemas';
import { ValidationError } from 'joi';

@autoInjectable()
export class RestockProductCommandHandler implements IOperationHandler<RestockProductCommand, ProductModel> {
  constructor(@inject(InjectionTokens.UnitOfWork) private readonly unitOfWork?: IUnitOfWork) {}

  async handle(command: RestockProductCommand): Promise<ProductModel> {
    logger.info(command.stringify());

    await this.validateInput(command);
    const product = await this.unitOfWork!.productRepository.getById(command.productId);

    if (!product) {
      throw new DomainError(`Product with [id=${command.productId}] does not exist`, DomainErrorsEnum.NotFound);
    }

    product.restock(command.count);
    await this.unitOfWork!.productRepository.persist(product);

    return product;
  }

  private async validateInput(command: RestockProductCommand): Promise<void> {
    try {
      await productStockSchema.validateAsync(command, { stripUnknown: true });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new DomainError(error.message, DomainErrorsEnum.ValidationError, error.details);
      }
    }
  }
}
