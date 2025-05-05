import type { IResource } from './resources/types'
import type { IRole } from './roles/types'
import type { IUser } from './users/types'

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

export interface IUpdateReq<
  T = unknown,
  U = T extends { id: infer P } ? P : string | number
> {
  id: U;
  fields: T;
}
