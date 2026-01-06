import { PageModel, PageOptionsModel, ProductModel } from '../../domain';

export interface IProductRepository {
  getAll(options?: PageOptionsModel): Promise<PageModel<ProductModel>>;
  persist(model: ProductModel): Promise<ProductModel>;
}
