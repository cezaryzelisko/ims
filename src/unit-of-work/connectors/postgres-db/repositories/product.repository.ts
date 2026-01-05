import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { IProductRepository } from '../../../interfaces';
import { PageOptionsModel, PageModel, ProductModel } from '../../../../domain';

export class ProductRepository extends Repository<ProductEntity> implements IProductRepository {
  async getAll(options?: PageOptionsModel): Promise<PageModel<ProductModel>> {
    const opts = PageOptionsModel.from(options);
    const [entities, count] = await this.createQueryBuilder('product')
      .skip(opts.offset)
      .take(opts.limit)
      .getManyAndCount();

    return new PageModel(
      entities.map((entity) => ProductEntity.toDomain(entity)),
      count,
      opts,
    );
  }
}
