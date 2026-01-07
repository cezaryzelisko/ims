import uuid from 'uuid';
import { PageModel, PageOptionsModel } from '../../../domain';

export abstract class InMemoryRepository<T extends { id?: string | undefined }> {
  protected items: Record<string, T> = {};

  async getById(id: string): Promise<T | null> {
    return this.items[id] || null;
  }

  async getAll(options?: PageOptionsModel): Promise<PageModel<T>> {
    const opts = PageOptionsModel.from(options);
    const items = Object.values(this.items);
    const pageItems = items.slice(opts.offset, opts.offset + opts.limit);

    return new PageModel(pageItems, items.length, opts);
  }

  async getManyByIds(ids: string[]): Promise<T[]> {
    return Object.values(this.items).filter((item) => ids.includes(item.id!));
  }

  async persist(customer: T): Promise<T> {
    customer.id = uuid.v4();
    this.items[customer.id] = customer;

    return customer;
  }
}
