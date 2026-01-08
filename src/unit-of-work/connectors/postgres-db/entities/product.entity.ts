import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProductCategoryEnum, ProductModel } from '../../../../domain';
import { numericColumnTransformer } from '../utils';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50 })
  name!: string;

  @Column({ length: 50 })
  description!: string;

  @Column({ type: 'numeric', transformer: numericColumnTransformer })
  price!: number;

  @Column({ type: 'int' })
  stock!: number;

  @Column({ type: 'enum', enum: ProductCategoryEnum })
  category!: ProductCategoryEnum;

  static fromDomain(model: ProductModel): ProductEntity {
    const entity = new ProductEntity();
    entity.id = model.id!;
    entity.name = model.name;
    entity.description = model.description;
    entity.price = model.price;
    entity.stock = model.stock;
    entity.category = model.category;

    return entity;
  }

  static toDomain(entity?: ProductEntity | null): ProductModel | null {
    if (!entity) {
      return null;
    }

    return new ProductModel({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      stock: entity.stock,
      category: entity.category,
    });
  }
}
