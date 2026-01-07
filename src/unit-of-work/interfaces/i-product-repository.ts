import { PageModel, PageOptionsModel, ProductModel } from '../../domain';

export interface IProductRepository {
  getAll(options?: PageOptionsModel): Promise<PageModel<ProductModel>>;
  getManyByIds(ids: string[]): Promise<ProductModel[]>;
  getById(id: string): Promise<ProductModel | null>;
  persist(model: ProductModel): Promise<ProductModel>;
}
