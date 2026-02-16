import { Store } from '../entrypoint/store';

export class DefaultStore<TItem extends { id: string }, TId extends string = TItem['id']> implements Store<TItem, TId> {
  private values: Readonly<Record<string, TItem>> = {};

  constructor(
    private readonly loadValues: () => Record<string, TItem>,
    private readonly saveValues: (values: Record<string, TItem>) => void,
  ) {
    this.values = loadValues();
  }

  getById(id: TId): TItem {
    const value = this.values[id];
    if (!value) {
      throw new Error(`Value not found for id: ${id}`);
    }
    return value;
  }

  getByQuery(query: (value: TItem) => boolean): TItem {
    const value = Object.values(this.values).find(query);
    if (!value) {
      throw new Error(`Value not found for query: ${query}`);
    }
    return value;
  }

  getAllByIds(ids: TId[]): TItem[] {
    return ids.map((id) => this.getById(id));
  }

  getAll(): TItem[] {
    return Object.values(this.values);
  }

  findById(id: TId): TItem | null {
    return this.values[id] || null;
  }

  findByQuery(query: (value: TItem) => boolean): TItem | null {
    return Object.values(this.values).find(query) || null;
  }

  findAllByIds(ids: TId[]): TItem[] {
    return ids.map((id) => this.findById(id)).filter((value): value is TItem => value !== null);
  }

  findAllByQuery(query: (value: TItem) => boolean): TItem[] {
    return Object.values(this.values).filter(query);
  }

  put(value: TItem): TItem {
    this.values = { ...this.values, [value.id as TId]: value };
    this.saveValues(this.values);
    return value;
  }

  putAll(values: TItem[]): TItem[] {
    this.values = { ...this.values, ...values.reduce((acc, value) => ({ ...acc, [value.id as TId]: value }), {}) };
    this.saveValues(this.values);
    return values;
  }

  removeById(id: TId): void {
    const mutatableValues = { ...this.values };
    delete mutatableValues[id];
    this.values = mutatableValues;
    this.saveValues(this.values);
  }

  removeAllByIds(ids: TId[]): void {
    const mutatableValues = { ...this.values };
    ids.forEach((id) => delete mutatableValues[id]);
    this.values = mutatableValues;
    this.saveValues(this.values);
  }

  removeAllByQuery(query: (value: TItem) => boolean): void {
    const mutatableValues = { ...this.values };
    Object.entries(this.values).forEach(([key, value]) => {
      if (!query(value)) {
        delete mutatableValues[key];
      }
    });
    this.values = mutatableValues;
    this.saveValues(this.values);
  }

  generateId<TGeneratedId extends string = TId>(type?: string): TGeneratedId {
    return crypto.randomUUID() as TGeneratedId;
  }
}
