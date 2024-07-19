export interface IFindAndCountRes<T> {
  rows: T[];
  count: number;
}

export type IListReq<T = { search: string }> = {
  filter?: T;
  count?: boolean;
  page?: number;
  quantity?: number;
};

export interface IUpdateReq<
  T = unknown,
  U = T extends { id: infer P } ? P : string | number
> {
  id: U;
  fields: Partial<T>;
}
