import { ProductModel } from '../../domain';

export class ProductDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly price: number,
    readonly stock: number,
  ) {}

  static fromDomain(model: ProductModel): ProductDto {
    return new ProductDto(model.id!, model.name, model.description, model.price, model.stock);
  }
}
