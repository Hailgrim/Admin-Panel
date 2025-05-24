import type { IRights } from './database';
import type { IUser } from './user';

export interface IRole {
  id: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  admin: boolean;
  default: boolean;
  users?: IUser[];
  rights?: IRights[];
}

export type TCreateRole = Pick<IRole, 'name' | 'description' | 'enabled'> &
  Partial<Pick<IRole, 'admin' | 'default'>>;

export type TGetRoles = Partial<
  Pick<IRole, 'name' | 'description' | 'enabled'>
>;

export type TUpdateRole = Partial<
  Pick<IRole, 'name' | 'description' | 'enabled'>
>;
