import { Rights } from 'libs/constants';
import { IUsersRoles } from 'src/database/database.types';
import { IResource } from 'src/resources/resources.types';

export abstract class IRole {
  id: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  admin: boolean;
  default: boolean;
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

export interface IRoleConditions {
  path: string;
  action: Rights;
}
