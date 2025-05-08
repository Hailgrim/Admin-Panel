import { IFetchRes, IReqArgs, IUpdateReq } from '../types';
import serverFetch from '../serverFetch';
import {
  IGetListResponse,
  IQueryItems,
  IRights,
  IRole,
  ROUTES,
  TCreateRole,
  TGetListRequest,
  TGetRoles,
  TUpdateRole,
} from '@ap/shared';

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

  updateResourcesArgs(payload: IUpdateReq<IRights[], IRole['id']>): IReqArgs {
    return {
      url: ROUTES.api.roleResources(payload.id),
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
