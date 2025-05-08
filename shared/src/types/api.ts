export type TGetListRequest<T = unknown> = {
  reqLimit?: number;
  reqPage?: number;
  reqCount?: boolean;
} & T;

export interface IGetListResponse<T = unknown> {
  rows: T[];
  count?: number;
}

export interface IQueryItems<T> {
  items: T[];
}
