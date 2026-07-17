export interface IRepository<T extends { id: string }> {
  findAll(): T[];
  findById(id: string): T | undefined;
  create(data: Omit<T, 'id'>): T;
  update(id: string, data: Partial<Omit<T, 'id'>>): T | undefined;
  delete(id: string): boolean;
}

export class InMemoryRepository<T extends { id: string }> implements IRepository<T> {
  protected items: T[] = [];
  private nextId = 1;

  constructor(private readonly idPrefix: string) {}

  seed(items: T[]): void {
    this.items = [...items];
    const highestSuffix = items.reduce((max, item) => {
      const match = /-(\d+)$/.exec(item.id);
      const suffixText = match?.[1];
      const suffix = suffixText ? Number.parseInt(suffixText, 10) : 0;
      return Number.isFinite(suffix) && suffix > max ? suffix : max;
    }, 0);
    this.nextId = highestSuffix + 1;
  }

  findAll(): T[] {
    return [...this.items];
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(data: Omit<T, 'id'>): T {
    const item = { ...data, id: `${this.idPrefix}-${this.nextId++}` } as T;
    this.items.push(item);
    return item;
  }

  update(id: string, data: Partial<Omit<T, 'id'>>): T | undefined {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    const updated = { ...this.items[index], ...data } as T;
    this.items[index] = updated;
    return updated;
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}
