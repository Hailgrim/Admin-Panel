export type TGetListRequest<T = unknown> = {
  reqLimit?: number;
  reqPage?: number;
  reqCount?: boolean;
} & T;

export interface IGetListResponse<T = unknown> {
  rows: T[];
  count?: number;
  page?: number;
  limit?: number;
}

export interface IQueryItems<T> {
  items: T[];
}

export interface IUpdateReq<
  T = unknown,
  U = T extends { id: infer P } ? P : string | number
> {
  id: U;
  fields: T;
}
