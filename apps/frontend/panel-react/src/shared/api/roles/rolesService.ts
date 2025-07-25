import { IFetchRes, IReqArgs } from '../types';
import serverFetch from '../serverFetch';
import {
  IGetListResponse,
  IQueryItems,
  IRights,
  IRole,
  IUpdateReq,
  TCreateRole,
  TGetListRequest,
  TGetRoles,
  TUpdateRole,
} from '@ap/shared/src/types';
import { ROUTES } from '@ap/shared/src/libs';

class RolesService {
  createArgs(payload: TCreateRole): IReqArgs {
    return {
      url: ROUTES.api.roles,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  getOneArgs(payload: IRole['id']): IReqArgs {
    return {
      url: ROUTES.api.role(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async getOne(payload: IRole['id']): Promise<IFetchRes<IRole>> {
    return serverFetch<IRole>(this.getOneArgs(payload));
  }

  getListArgs(payload?: TGetListRequest<TGetRoles>): IReqArgs {
    return {
      url: ROUTES.api.roles,
      method: 'GET',
      credentials: 'include',
      params: payload,
    };
  }

  async getList(
    payload?: TGetListRequest<TGetRoles>
  ): Promise<IFetchRes<IGetListResponse<IRole>>> {
    return serverFetch<IGetListResponse<IRole>>(this.getListArgs(payload));
  }

  updateArgs(payload: IUpdateReq<TUpdateRole, IRole['id']>): IReqArgs {
    return {
      url: ROUTES.api.role(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  updateRightsArgs(
    payload: IUpdateReq<IQueryItems<IRights>, IRole['id']>
  ): IReqArgs {
    return {
      url: ROUTES.api.roleRights(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  deleteArgs(payload: IQueryItems<IRole['id']>): IReqArgs {
    return {
      url: ROUTES.api.roles,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    };
  }
}

const rolesService = new RolesService();
export default rolesService;
