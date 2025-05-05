import { IResource } from '../resources/types';
import { IUsersRoles } from '../types';

export interface IRole {
  id: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  admin: boolean;
  default: boolean;
  resources?: IResource[];
  UsersRolesModel?: IUsersRoles;
}

export type TCreateRole = Pick<IRole, 'name' | 'description' | 'enabled'> &
  Partial<Pick<IRole, 'admin' | 'default'>>;

export type TGetRoles = Partial<
  Pick<IRole, 'name' | 'description' | 'enabled'>
>;

export type TUpdateRole = Partial<
  Pick<IRole, 'name' | 'description' | 'enabled'>
>;
