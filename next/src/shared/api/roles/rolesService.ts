import { ROUTES } from '@/shared/lib/constants';
import { IRole, TCreateRole, TGetRoles, TUpdateRole } from './types';
import {
  IFetchRes,
  IGetListResponse,
  TGetListRequest,
  IReqArgs,
  IUpdateReq,
  IQueryItems,
  IRights,
} from '../types';
import serverFetch from '../serverFetch';

class RolesService {
  createArgs(payload: TCreateRole): IReqArgs {
    return {
      url: ROUTES.api.roles,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  findAllArgs(payload?: TGetListRequest<TGetRoles>): IReqArgs {
    return {
      url: ROUTES.api.roles,
      method: 'GET',
      credentials: 'include',
      params: payload,
    };
  }

  async findAll(
    payload?: TGetListRequest<TGetRoles>
  ): Promise<IFetchRes<IGetListResponse<IRole>>> {
    return serverFetch<IGetListResponse<IRole>>(this.findAllArgs(payload));
  }

  findOneArgs(payload: IRole['id']): IReqArgs {
    return {
      url: ROUTES.api.role(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async findOne(payload: IRole['id']): Promise<IFetchRes<IRole>> {
    return serverFetch<IRole>(this.findOneArgs(payload));
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
