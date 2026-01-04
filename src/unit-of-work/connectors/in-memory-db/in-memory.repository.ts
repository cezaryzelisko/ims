export abstract class InMemoryRepository<T> {
  protected items: Record<string, T> = {};

  async findById(id: string): Promise<T | null> {
    return this.items[id] || null;
  }

  async save(id: string, item: T): Promise<T> {
    this.items[id] = item;
    return item;
  }
}
