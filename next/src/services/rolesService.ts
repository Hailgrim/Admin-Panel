import serverFetch from '@/hooks/serverFetch';
import { ROUTES } from '@/lib/constants';
import {
  IFetchRes,
  IFindAndCountRes,
  IListReq,
  IReqArgs,
  IRole,
  IRoleCreate,
  IRolesResources,
  IUpdateReq,
} from '@/lib/types';

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
      this.findAllArgs(payload),
      true
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
    const { data: result, error } = await serverFetch<IFindAndCountRes<IRole>>(
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
      url: ROUTES.api.role(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async findOne(payload: number): Promise<IFetchRes<IRole | null>> {
    const { data, error } = await serverFetch<IRole>(
      this.findOneArgs(payload),
      true
    );
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

  updateResourcesArgs(payload: IUpdateReq<IRolesResources[]>): IReqArgs {
    return {
      url: ROUTES.api.roleResources(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  deleteArgs(payload: number | number[]): IReqArgs {
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
