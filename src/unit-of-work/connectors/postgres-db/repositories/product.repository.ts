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
      entities.map((entity) => ProductEntity.toDomain(entity)!),
      count,
      opts,
    );
  }

  async getById(id: string): Promise<ProductModel | null> {
    const entity = await this.createQueryBuilder('product').where('id = :id', { id }).getOne();
    return ProductEntity.toDomain(entity);
  }

  async persist(model: ProductModel): Promise<ProductModel> {
    const entity = await this.save(ProductEntity.fromDomain(model));
    return ProductEntity.toDomain(entity)!;
  }
}
