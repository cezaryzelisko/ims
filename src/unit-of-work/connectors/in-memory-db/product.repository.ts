import { ProductModel } from '../../../domain';
import { IProductRepository } from '../../interfaces';
import { InMemoryRepository } from './in-memory.repository';

export class ProductRepository extends InMemoryRepository<ProductModel> implements IProductRepository {}
