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

export interface IUpdateReq<T> {
  id: number;
  fields: Partial<T>;
}
