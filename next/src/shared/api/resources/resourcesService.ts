import { ROUTES } from '@/shared/lib/constants';
import {
  IFetchRes,
  IGetListResponse,
  TGetListRequest,
  IReqArgs,
  IQueryItems,
  IUpdateReq,
} from '../types';
import {
  IResource,
  TCreateResource,
  TGetResources,
  TUpdateResource,
} from './types';
import serverFetch from '../serverFetch';

class ResourcesService {
  createArgs(payload: TCreateResource): IReqArgs {
    return {
      url: ROUTES.api.resources,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  findAllArgs(payload?: TGetListRequest<TGetResources>): IReqArgs {
    return {
      url: ROUTES.api.resources,
      method: 'GET',
      credentials: 'include',
      params: payload,
    };
  }

  async findAll(
    payload?: TGetListRequest<TGetResources>
  ): Promise<IFetchRes<IGetListResponse<IResource>>> {
    return serverFetch<IGetListResponse<IResource>>(this.findAllArgs(payload));
  }

  findOneArgs(payload: IResource['id']): IReqArgs {
    return {
      url: ROUTES.api.resource(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async findOne(payload: IResource['id']): Promise<IFetchRes<IResource>> {
    return serverFetch<IResource>(this.findOneArgs(payload));
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
