export interface IFindAndCountRes<T> {
  rows: T[];
  count: number;
}

export type IListReq<T = unknown> = {
  count?: boolean;
  page?: number;
  quantity?: number;
  search?: string;
  filter?: T;
};

export interface IUpdateReq<
  T = unknown,
  U = T extends { id: infer P } ? P : string | number
> {
  id: U;
  fields: Partial<T>;
}
