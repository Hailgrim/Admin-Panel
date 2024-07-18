import type { IResource } from '../resources/types';

export interface IRole {
  id: string;
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
  userId: string;
  roleId: string;
}

export interface IRoleAndResources {
  role: IRole;
  resources?: IResource[];
}
