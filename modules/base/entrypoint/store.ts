export interface Store<T extends { id: string }, TId extends string = T['id']> {
  getById(id: TId): T;
  getAllByIds(ids: TId[]): T[];
  getByQuery(query: (value: T) => boolean): T;
  getAll(): T[];

  findById(id: TId): T | null;
  findAllByIds(ids: TId[]): T[];
  findByQuery(query: (value: T) => boolean): T | null;
  findAllByQuery(query: (value: T) => boolean): T[];

  put(value: T): T;
  putAll(values: T[]): T[];

  removeById(id: TId): void;
  removeAllByIds(ids: TId[]): void;
  removeAllByQuery(query: (value: T) => boolean): void;

  generateId(): TId;
  generateId<TGeneratedId extends string>(type: TGeneratedId): TGeneratedId;
}
