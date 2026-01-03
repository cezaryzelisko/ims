export class ProductModel {
  id?: string;
  name!: string;
  description!: string;
  price!: number;
  stock!: number;

  constructor(data: Partial<ProductModel>) {
    Object.assign(this, data);
  }
}
