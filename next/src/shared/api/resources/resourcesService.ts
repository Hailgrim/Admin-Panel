import { IFetchRes, IReqArgs, IUpdateReq } from '../types';
import serverFetch from '../serverFetch';
import {
  IGetListResponse,
  IQueryItems,
  IResource,
  ROUTES,
  TCreateResource,
  TGetListRequest,
  TGetResources,
  TUpdateResource,
} from '@ap/shared';

class ResourcesService {
  createArgs(payload: TCreateResource): IReqArgs {
    return {
      url: ROUTES.api.resources,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  getOneArgs(payload: IResource['id']): IReqArgs {
    return {
      url: ROUTES.api.resource(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async getOne(payload: IResource['id']): Promise<IFetchRes<IResource>> {
    return serverFetch<IResource>(this.getOneArgs(payload));
  }

  getListArgs(payload?: TGetListRequest<TGetResources>): IReqArgs {
    return {
      url: ROUTES.api.resources,
      method: 'GET',
      credentials: 'include',
      params: payload,
    };
  }

  async getList(
    payload?: TGetListRequest<TGetResources>
  ): Promise<IFetchRes<IGetListResponse<IResource>>> {
    return serverFetch<IGetListResponse<IResource>>(this.getListArgs(payload));
  }

  updateArgs(payload: IUpdateReq<TUpdateResource, IResource['id']>): IReqArgs {
    return {
      url: ROUTES.api.resource(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  deleteArgs(payload: IQueryItems<IResource['id']>): IReqArgs {
    return {
      url: ROUTES.api.resources,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    };
  }
}

const resourcesService = new ResourcesService();
export default resourcesService;
