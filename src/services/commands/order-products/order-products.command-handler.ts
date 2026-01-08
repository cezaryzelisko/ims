import { autoInjectable, inject } from 'tsyringe';
import { InjectionTokens, IOperationHandler } from '../../common';
import { OrderProductsCommand } from './order-products.command';
import { IOrderRepository, IProductRepository, IUnitOfWork, RepositoryEnum } from '../../../unit-of-work';
import { logger } from '../../../utils';
import { DomainError, DomainErrorsEnum, OrderModel, ProductModel } from '../../../domain';
import { ValidationError } from 'joi';
import { idSchema } from '../../../schemas';

@autoInjectable()
export class OrderProductsCommandHandler implements IOperationHandler<OrderProductsCommand, OrderModel> {
  constructor(@inject(InjectionTokens.UnitOfWork) private readonly unitOfWork?: IUnitOfWork) {}

  async handle(command: OrderProductsCommand): Promise<OrderModel> {
    logger.info(command.stringify());

    await this.validateInput(command);
    const products = await this.getProducts(command.productIds);

    return this.makeOrder(command, products);
  }

  private async validateInput(command: OrderProductsCommand): Promise<void> {
    try {
      await Promise.all([command.customerId, ...command.productIds].map((id) => idSchema.validateAsync(id)));
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new DomainError(error.message, DomainErrorsEnum.ValidationError, error.details);
      }
    }
  }

  private async getProducts(productIds: string[]): Promise<ProductModel[]> {
    const uniqueIds = new Set(productIds);
    const products = await this.unitOfWork!.productRepository.getManyByIds(Array.from(uniqueIds));

    if (!products.length) {
      throw new DomainError(
        'An order can not be made without specifying valid list of products',
        DomainErrorsEnum.NotAllowedError,
      );
    }

    this.assignNewProductStockLevels(productIds, products);

    return products;
  }

  private assignNewProductStockLevels(productIds: string[], products: ProductModel[]): void {
    const productsCount = productIds.reduce(
      (acc, productId) => {
        if (acc[productId] === undefined) {
          acc[productId] = 0;
        }

        acc[productId]++;

        return acc;
      },
      {} as Record<string, number>,
    );

    for (const product of products) {
      product.sell(productsCount[product.id!]!);
    }
  }

  private async makeOrder(command: OrderProductsCommand, products: ProductModel[]): Promise<OrderModel> {
    let order = new OrderModel({ customerId: command.customerId, productIds: command.productIds });
    order.calculateOrderValue(products, command.region);

    const transaction = await this.unitOfWork!.executeInTransaction(
      async (getRepoFn: (repoKey: RepositoryEnum) => unknown) => {
        const orderRepository = getRepoFn(RepositoryEnum.Order) as IOrderRepository;
        const productRepository = getRepoFn(RepositoryEnum.Product) as IProductRepository;

        order = await orderRepository.orderProducts(order);
        await Promise.all(products.map((product) => productRepository.persist(product)));

        return order;
      },
    );

    if (transaction.error) {
      throw new DomainError('Unable to make an order', DomainErrorsEnum.ProcessingError);
    }

    return transaction.result!;
  }
}
