import { ROUTES } from '@/shared/lib/constants';
import { IRole, IRoleCreate } from './types';
import {
  IFetchRes,
  IFindAndCountRes,
  IListReq,
  IReqArgs,
  IUpdateReq,
} from '../types';
import { IRolesResources } from '../resources/types';
import serverFetch from '../serverFetch';

class RolesService {
  createArgs(payload: IRoleCreate): IReqArgs {
    return {
      url: ROUTES.api.roles,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  findAllArgs(payload?: IListReq<IRole>): IReqArgs {
    return {
      url: ROUTES.api.roles,
      method: 'GET',
      credentials: 'include',
      params: payload,
    };
  }

  async findAll(payload?: IListReq<IRole>): Promise<IFetchRes<IRole[]>> {
    const { data, error } = await serverFetch<IRole[]>(
      this.findAllArgs(payload)
    );
    return { data, error };
  }

  findAndCountAllArgs(payload?: IListReq<IRole>): IReqArgs {
    return {
      url: ROUTES.api.roles,
      method: 'GET',
      credentials: 'include',
      params: { ...payload, count: true },
    };
  }

  async findAndCountAll(
    payload?: IListReq<IRole>
  ): Promise<IFetchRes<IFindAndCountRes<IRole>>> {
    return serverFetch<IFindAndCountRes<IRole>>(
      this.findAndCountAllArgs(payload)
    );
  }

  findOneArgs(payload: IRole['id']): IReqArgs {
    return {
      url: ROUTES.api.role(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async findOne(payload: IRole['id']): Promise<IFetchRes<IRole | null>> {
    const { data, error } = await serverFetch<IRole>(this.findOneArgs(payload));
    return { data, error };
  }

  updateArgs(payload: IUpdateReq<IRole>): IReqArgs {
    return {
      url: ROUTES.api.role(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  updateResourcesArgs(
    payload: IUpdateReq<IRolesResources[], IRole['id']>
  ): IReqArgs {
    return {
      url: ROUTES.api.roleResources(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  deleteArgs(payload: IRole['id'][]): IReqArgs {
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
