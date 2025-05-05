import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { IResource } from './resources/types';
import { IRole } from './roles/types';
import { IUser } from './users/types';

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

export interface IRights {
  roleId: IRole['id'];
  resourceId: IResource['id'];
  creating: boolean;
  reading: boolean;
  updating: boolean;
  deleting: boolean;
}

export interface IUsersRoles {
  userId: IUser['id'];
  roleId: IRole['id'];
}

export interface IUpdateReq<
  T = unknown,
  U = T extends { id: infer P } ? P : string | number
> {
  id: U;
  fields: T;
}

export interface IFetchRes<T = unknown> {
  data: T | null;
  error: number | null;
  newCookies?: ResponseCookie[] | null;
}

export interface IReqArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, unknown>;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  mode?: RequestMode;
}
