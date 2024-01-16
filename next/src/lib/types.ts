import { ReactNode } from 'react';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import d from '../locales/dictionary';
import type en from '../locales/en';

export type LangList = keyof typeof d;
export type LangDictionary = typeof en;

export interface IReqArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  params?: Record<string, any>;
  credentials?: RequestCredentials;
  headers?: Headers | Record<string, string | undefined>;
}

export interface IFetchRes<T = unknown> {
  data: T | null;
  error: number | null;
  newCookies?: ResponseCookie[] | null;
}

export interface IAlert {
  id: number;
  text?: string;
  type?: 'error' | 'warning' | 'success';
  deleted?: boolean;
}

export interface IServerPage<T = void, U = void> {
  params: T extends void ? Record<string, string | undefined> : T;
  searchParams: U extends void ? Record<string, string | undefined> : U;
}

export interface IClientPage<T = unknown> {
  h1?: string;
  data?: T | null;
}

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
  id: number;
  fields: Partial<T>;
}

export interface IMenuItem {
  href?: string;
  text?: string;
  icon?: ReactNode;
  childs?: IMenuItem[];
}

export interface IUserSignIn {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface IUser {
  id: number;
  email: string;
  name: string;
  enabled: boolean;
  verified: boolean;
  roles?: IRole[];
  createdAt?: string;
}
export type IUserSignUp = Pick<IUser, 'name' | 'email'> & { password: string };
export type IUserCreate = Pick<IUser, 'name' | 'email' | 'enabled'> & {
  password: string;
};

export interface IVerifyUser {
  email: string;
  code: string;
}

export interface IResetPassword extends IVerifyUser {
  password: string;
}

export interface IRole {
  id: number;
  name: string;
  description: string | null;
  enabled: boolean;
  admin: boolean;
  default: boolean;
  resources?: IResource[];
  UsersRoles?: IUsersRoles;
}
export type IRoleCreate = Pick<IRole, 'name' | 'description' | 'enabled'>;
export interface IUsersRoles {
  userId: number;
  roleId: number;
}

export interface IResource {
  id: number;
  name: string;
  path: string;
  description: string | null;
  enabled: boolean;
  default: boolean;
  RolesResources?: IRolesResources;
}
export type IResourceCreate = Pick<
  IResource,
  'name' | 'path' | 'description' | 'enabled'
>;
export interface IRolesResources {
  roleId: number;
  resourceId: number;
  creating: boolean;
  reading: boolean;
  updating: boolean;
  deleting: boolean;
}

export interface IRoleAndResources {
  role: IRole;
  resources?: IResource[] | null;
}

export interface IUserAndRoles {
  user: IUser;
  roles?: IRole[] | null;
}
