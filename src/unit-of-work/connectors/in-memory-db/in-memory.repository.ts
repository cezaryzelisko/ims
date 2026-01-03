export abstract class InMemoryRepository<T> {
  protected items: Record<string, T> = {};

  findById(id: string): T | null {
    return this.items[id] || null;
  }

  save(id: string, item: T): T {
    this.items[id] = item;
    return item;
  }
}
