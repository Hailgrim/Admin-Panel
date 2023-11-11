import { FastifyRequest } from 'fastify';

import { Rights } from './constants';

export interface IFindAndCount<T> {
  rows: T[];
  count: number;
}

export interface IRoleConditions {
  path: string;
  action: Rights;
}

export abstract class ITokensResponse {
  accessToken: string;
  refreshToken: string;
}

export abstract class ICookiesResponse extends ITokensResponse {
  sessionId: number;
}

export interface IRequestUser {
  id: number;
  email: string;
  sessionId: number;
  sessionHash: string;
}
export type FastifyRequestWithUser = FastifyRequest & { user: IUser };
export type FastifyRequestWithAuth = FastifyRequest & { user: IRequestUser };

export abstract class ISession {
  userId: number;
  hash: string;
  expires: Date;
}

export abstract class IUser {
  id?: any;
  email: string;
  password: string;
  name: string;
  enabled: boolean;
  verified: boolean;
  verificationCode?: string | null;
  resetPasswordCode?: string | null;
  roles?: IRole[];
}
export type SignUpFields = Pick<IUser, 'email' | 'password' | 'name'>;
export type CreateUserFields = Pick<
  IUser,
  'email' | 'password' | 'name' | 'enabled'
>;
export type GetUsersFields = Partial<
  Omit<IUser, 'password' | 'verificationCode' | 'resetPasswordCode'>
>;
export type UpdateUserFields = Partial<Omit<IUser, 'roles' | 'id'>>;

export abstract class IUsersRoles {
  userId: number;
  roleId: number;
}
export abstract class IRole {
  id?: any;
  name: string;
  description?: string | null;
  enabled: boolean;
  admin: boolean;
  default: boolean;
  users?: IUser[];
  resources?: IResource[];
  UsersRoles?: IUsersRoles;
}
export type CreateRoleFields = Pick<IRole, 'name' | 'description' | 'enabled'> &
  Partial<Pick<IRole, 'admin' | 'default'>>;
export type GetRolesFields = Partial<
  Pick<IRole, 'name' | 'description' | 'enabled'>
>;
export type UpdateRoleFields = Partial<
  Pick<IRole, 'name' | 'description' | 'enabled'>
>;

export type IRolesResources = {
  roleId: number;
  resourceId: number;
  creating: boolean;
  reading: boolean;
  updating: boolean;
  deleting: boolean;
};
export abstract class IResource {
  id?: any;
  name: string;
  path: string;
  description?: string | null;
  enabled: boolean;
  default: boolean;
  roles?: IRole[];
  RolesResources?: IRolesResources;
}
export type CreateResourceFields = Pick<
  IResource,
  'name' | 'path' | 'description' | 'enabled'
> &
  Partial<Pick<IResource, 'default'>>;
export type GetResourcesFields = Partial<
  Pick<IResource, 'name' | 'path' | 'description' | 'enabled'>
>;
export type UpdateResourceFields = Partial<
  Pick<IResource, 'name' | 'path' | 'description' | 'enabled'>
>;
