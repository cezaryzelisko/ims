import { autoInjectable, inject } from 'tsyringe';
import { InjectionTokens, IOperationHandler } from '../../common';
import { DomainError, DomainErrorsEnum, ProductModel } from '../../../domain';
import { logger } from '../../../utils';
import { CreateProductCommand } from './create-product.command';
import { productSchema } from '../../../schemas';
import { ValidationError } from 'joi';
import { IUnitOfWork } from '../../../unit-of-work';

@autoInjectable()
export class CreateProductCommandHandler implements IOperationHandler<CreateProductCommand, ProductModel> {
  constructor(@inject(InjectionTokens.UnitOfWork) private readonly unitOfWork?: IUnitOfWork) {}

  async handle(command: CreateProductCommand): Promise<ProductModel | null> {
    logger.info(command.stringify());

    await this.validateInput(command);

    return this.unitOfWork!.productRepository.persist(command.product);
  }

  private async validateInput(command: CreateProductCommand): Promise<void> {
    try {
      await productSchema.validateAsync(command.product, { stripUnknown: true });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new DomainError(error.message, DomainErrorsEnum.ValidationError, error.details);
      }
    }
  }
}
