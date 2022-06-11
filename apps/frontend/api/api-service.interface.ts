export interface ApiService<T> {
  find(body: Partial<T>): Promise<T>;
  create(body: T): Promise<T>;
}
