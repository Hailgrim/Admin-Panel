import { IResource } from 'src/resources/resources.types';
import { IRole } from 'src/roles/roles.types';
import { IUser } from 'src/users/users.types';

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
