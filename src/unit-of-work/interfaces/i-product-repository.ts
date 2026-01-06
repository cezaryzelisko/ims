import { PageModel, PageOptionsModel, ProductModel } from '../../domain';

export interface IProductRepository {
  getAll(options?: PageOptionsModel): Promise<PageModel<ProductModel>>;
  getById(id: string): Promise<ProductModel | null>;
  persist(model: ProductModel): Promise<ProductModel>;
}
