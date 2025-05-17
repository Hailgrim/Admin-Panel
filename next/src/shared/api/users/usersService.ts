import { IFetchRes, IReqArgs } from '../types';
import serverFetch from '../serverFetch';
import {
  IGetListResponse,
  IQueryItems,
  IUpdateReq,
  IUser,
  IUsersRoles,
  ROUTES,
  TCreateUser,
  TGetListRequest,
  TGetUsers,
  TUpdateUser,
} from '@ap/shared';

class UsersService {
  createArgs(payload: TCreateUser): IReqArgs {
    return {
      url: ROUTES.api.users,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  getOneArgs(payload: IUser['id']): IReqArgs {
    return {
      url: ROUTES.api.user(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async getOne(payload: IUser['id']): Promise<IFetchRes<IUser>> {
    return serverFetch<IUser>(this.getOneArgs(payload));
  }

  getListArgs(payload?: TGetListRequest<TGetUsers>): IReqArgs {
    return {
      url: ROUTES.api.users,
      method: 'GET',
      credentials: 'include',
      params: payload,
    };
  }

  async getList(
    payload?: TGetListRequest<TGetUsers>
  ): Promise<IFetchRes<IGetListResponse<IUser>>> {
    return serverFetch<IGetListResponse<IUser>>(this.getListArgs(payload));
  }

  updateArgs(payload: IUpdateReq<TUpdateUser, IUser['id']>): IReqArgs {
    return {
      url: ROUTES.api.user(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  updateRolesArgs(payload: IUpdateReq<IQueryItems<IUsersRoles>, IUser['id']>): IReqArgs {
    return {
      url: ROUTES.api.userRoles(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  deleteArgs(payload: IQueryItems<IUser['id']>): IReqArgs {
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
