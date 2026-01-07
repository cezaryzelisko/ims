import { ProductCategoryEnum, ProductModel } from '../../src/domain';
import { IUnitOfWork } from '../../src/unit-of-work';

export function saveProduct(unitOfWork: IUnitOfWork): Promise<ProductModel> {
  return unitOfWork.productRepository.persist(
    new ProductModel({
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      stock: 5,
      category: ProductCategoryEnum.Books,
    }),
  );
}
