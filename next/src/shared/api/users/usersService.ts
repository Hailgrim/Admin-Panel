import { ROUTES } from '@/shared/lib/constants';
import { IUser, TCreateUser, TGetUsers, TUpdateUser } from './types';
import {
  IFetchRes,
  IGetListResponse,
  TGetListRequest,
  IReqArgs,
  IUpdateReq,
  IQueryItems,
  IUsersRoles,
} from '../types';
import serverFetch from '../serverFetch';

class UsersService {
  createArgs(payload: TCreateUser): IReqArgs {
    return {
      url: ROUTES.api.users,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  findAllArgs(payload?: TGetListRequest<TGetUsers>): IReqArgs {
    return {
      url: ROUTES.api.users,
      method: 'GET',
      credentials: 'include',
      params: payload,
    };
  }

  async findAll(
    payload?: TGetListRequest<TGetUsers>
  ): Promise<IFetchRes<IGetListResponse<IUser>>> {
    return serverFetch<IGetListResponse<IUser>>(this.findAllArgs(payload));
  }

  findOneArgs(payload: IUser['id']): IReqArgs {
    return {
      url: ROUTES.api.user(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async findOne(payload: IUser['id']): Promise<IFetchRes<IUser>> {
    return serverFetch<IUser>(this.findOneArgs(payload));
  }

  updateArgs(payload: IUpdateReq<TUpdateUser, IUser['id']>): IReqArgs {
    return {
      url: ROUTES.api.user(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  updateRolesArgs(payload: IUpdateReq<IUsersRoles[], IUser['id']>): IReqArgs {
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
