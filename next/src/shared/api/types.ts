import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

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

export interface IFetchRes<T = unknown> {
  data: T | null;
  error: number | null;
  newCookies?: ResponseCookie[] | null;
}

export interface IReqArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  params?: Record<string, any>;
  credentials?: RequestCredentials;
  headers?: Headers | Record<string, string | undefined>;
  mode?: RequestMode;
}
