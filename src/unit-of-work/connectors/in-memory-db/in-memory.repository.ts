import { PageModel, PageOptionsModel } from '../../../domain';

export abstract class InMemoryRepository<T> {
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

  async save(id: string, item: T): Promise<T> {
    this.items[id] = item;
    return item;
  }
}
