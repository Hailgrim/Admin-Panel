import { ERights } from 'libs/constants';
import { IUsersRoles } from 'src/database/database.types';
import { IResource } from 'src/resources/resources.types';

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

export interface IRoleConditions {
  path: string;
  action: ERights;
}
