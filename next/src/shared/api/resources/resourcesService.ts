import { ROUTES } from '@/shared/lib/constants';
import {
  IFetchRes,
  IFindAndCountRes,
  IListReq,
  IReqArgs,
  IUpdateReq,
} from '../types';
import { IResource, IResourceCreate } from './types';
import serverFetch from '../serverFetch';

class ResourcesService {
  createArgs(payload: IResourceCreate): IReqArgs {
    return {
      url: ROUTES.api.resources,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  findAllArgs(payload?: IListReq<IResource>): IReqArgs {
    return {
      url: ROUTES.api.resources,
      method: 'GET',
      credentials: 'include',
      params: payload,
    };
  }

  async findAll(
    payload?: IListReq<IResource>
  ): Promise<IFetchRes<IResource[]>> {
    const { data, error } = await serverFetch<IResource[]>(
      this.findAllArgs(payload)
    );
    return { data, error };
  }

  findAndCountAllArgs(payload?: IListReq<IResource>): IReqArgs {
    return {
      url: ROUTES.api.resources,
      method: 'GET',
      credentials: 'include',
      params: { ...payload, count: true },
    };
  }

  async findAndCountAll(
    payload?: IListReq<IResource>
  ): Promise<IFetchRes<IFindAndCountRes<IResource>>> {
    const { data: result, error } = await serverFetch<
      IFindAndCountRes<IResource>
    >(this.findAndCountAllArgs(payload));
    return {
      data: { count: result?.count || 0, rows: result?.rows || [] },
      error,
    };
  }

  findOneArgs(payload: IResource['id']): IReqArgs {
    return {
      url: ROUTES.api.resource(payload),
      method: 'GET',
      credentials: 'include',
    };
  }

  async findOne(
    payload: IResource['id']
  ): Promise<IFetchRes<IResource | null>> {
    const { data, error } = await serverFetch<IResource>(
      this.findOneArgs(payload)
    );
    return { data, error };
  }

  updateArgs(payload: IUpdateReq<IResource>): IReqArgs {
    return {
      url: ROUTES.api.resource(payload.id),
      method: 'PATCH',
      credentials: 'include',
      body: payload.fields,
    };
  }

  deleteArgs(payload: IResource['id'] | IResource['id'][]): IReqArgs {
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
