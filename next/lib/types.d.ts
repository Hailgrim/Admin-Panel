import type en from '~/locales/en'

export type LangList = 'en' | 'ru'
export type LangDictionary = typeof en

export interface IAlert {
  id: number;
  text?: string;
  type?: 'error' | 'warning' | 'success';
}

export interface IMeta {
  title?: string;
  description?: string;
  h1?: string;
}

export interface IPagination {
  page?: number;
  quantity?: number;
  search?: string;
}

export interface IPage<T = void> {
  meta?: IMeta;
  pagination?: IPagination;
  content?: T | null;
}

export type IListReq<T> = IPagination & Partial<T> & {
  count?: boolean;
};

export interface IFindAndCountRes<T> {
  rows: T[];
  count: number;
}

export interface IUpdateReq<T> {
  id: number;
  fields: Partial<T>;
}

export interface ICookies {
  accessToken: string | null;
  refreshToken: string | null;
  sessionId?: string | number;
  rememberMe: boolean;
}

export interface ICreateCookieOptions {
  httpOnly?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
  path?: string;
  domain?: string;
  maxAge?: number;
}

export interface ISideBarItem {
  link?: string;
  name?: string;
  icon?: React.ReactNode;
  childs?: ISideBarItem[];
  isChild?: boolean;
  disabled?: boolean;
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
export type IUserSignUp = Pick<IUser, 'name' | 'email'> & { password: string; };
export type IUserCreate = Pick<IUser, 'name' | 'email' | 'enabled'> & { password: string; };

export interface IVerifyUser {
  email: string;
  code: string;
}

export interface IResetPassword extends IVerifyUser {
  password: string;
}

export interface IUsersRoles {
  userId: number;
  roleId: number;
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

export interface IRolesResources {
  roleId: number;
  resourceId: number;
  creating: boolean;
  reading: boolean;
  updating: boolean;
  deleting: boolean;
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
export type IResourceCreate = Pick<IResource, 'name' | 'path' | 'description' | 'enabled'>;

export interface IRoleAndResources {
  role: IRole;
  resources?: IResource[];
}

export interface IUserAndRoles {
  user: IUser;
  roles?: IRole[];
}