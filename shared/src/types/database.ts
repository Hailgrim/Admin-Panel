import { IResource } from './resource';
import { IRole } from './role';
import { IUser } from './user';

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
