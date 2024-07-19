import { ROUTES } from '@/shared/lib/constants';
import { IUser, IUserCreate } from './types';
import {
  IFetchRes,
  IFindAndCountRes,
  IListReq,
  IReqArgs,
  IUpdateReq,
} from '../types';
import { IUsersRoles } from '../roles/types';
import serverFetch from '../serverFetch';

class UsersService {
  createArgs(payload: IUserCreate): IReqArgs {
    return {
      url: ROUTES.api.users,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  findAllArgs(payload?: IListReq<IUser>): IReqArgs {
    return {
      url: ROUTES.api.users,
      method: 'GET',
      credentials: 'include',
      params: payload,
    };
  }

  findAndCountAllArgs(payload?: IListReq<IUser>): IReqArgs {
    return {
      url: ROUTES.api.users,
      method: 'GET',
      credentials: 'include',
      params: { ...payload, count: true },
    };
  }

  async findAndCountAll(
    payload?: IListReq<IUser>
  ): Promise<IFetchRes<IFindAndCountRes<IUser>>> {
    const { data: result, error } = await serverFetch<IFindAndCountRes<IUser>>(
      this.findAndCountAllArgs(payload)
    );
    return {
      data: { count: result?.count || 0, rows: result?.rows || [] },
      error,
    };
  }

  findOneArgs(payload: IUser['id']): IReqArgs {
    return {
      url: ROUTES.api.user(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async findOne(payload: IUser['id']): Promise<IFetchRes<IUser | null>> {
    const { data, error } = await serverFetch<IUser>(this.findOneArgs(payload));
    return { data, error };
  }

  updateArgs(payload: IUpdateReq<IUser>): IReqArgs {
    return {
      url: ROUTES.api.user(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  updateRolesArgs(payload: IUpdateReq<IUsersRoles[], number>): IReqArgs {
    return {
      url: ROUTES.api.userRoles(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  deleteArgs(payload: IUser['id'] | IUser['id'][]): IReqArgs {
    return {
      url: ROUTES.api.users,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    };
  }
}

const usersService = new UsersService();
export default usersService;
