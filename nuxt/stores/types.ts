export interface IFindAndCountRes<T> {
  rows: T[];
  count: number;
}

export type IListReq<T> = Partial<T> & {
  count?: boolean;
  page?: number;
  quantity?: number;
  search?: string;
};

export interface IUpdateReq<
  T = unknown,
  U = T extends { id: infer P } ? P : string | number
> {
  id: U;
  fields: Partial<T>;
}
