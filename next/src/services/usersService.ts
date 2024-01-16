import serverFetch from '@/hooks/serverFetch';
import { ROUTES } from '@/lib/constants';
import {
  IListReq,
  IReqArgs,
  IUser,
  IUserCreate,
  IUpdateReq,
  IUsersRoles,
  IFindAndCountRes,
  IFetchRes,
} from '@/lib/types';

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
      this.findAndCountAllArgs(payload),
      true
    );
    return {
      data: { count: result?.count || 0, rows: result?.rows || [] },
      error,
    };
  }

  findOneArgs(payload: number): IReqArgs {
    return {
      url: ROUTES.api.user(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async findOne(payload: number): Promise<IFetchRes<IUser | null>> {
    const { data, error } = await serverFetch<IUser>(
      this.findOneArgs(payload),
      true
    );
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

  updateRolesArgs(payload: IUpdateReq<IUsersRoles[]>): IReqArgs {
    return {
      url: ROUTES.api.userRoles(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  deleteArgs(payload: number | number[]): IReqArgs {
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
