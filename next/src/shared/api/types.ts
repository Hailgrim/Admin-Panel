import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export type IListReq<T> = Partial<T> & {
  count?: boolean;
  page?: number;
  quantity?: number;
  search?: string;
};

export interface IFindAndCountRes<T> {
  rows: T[];
  count: number;
}

export interface IUpdateReq<T> {
  id: string;
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
}
