import { useAPI } from '~/composables/useAPI/useAPI'
import type { IResource, IResourceCreate } from './types'
import type { IFindAndCountRes, IListReq, IUpdateReq } from '../types'

class ResourcesApi {
  create = useAPI<IResource, IResourceCreate>((payload) => ({
    url: ROUTES.api.resources,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  list = useAPI<IResource[], IListReq<IResource> | undefined>((payload) => ({
    url: ROUTES.api.resources,
    options: { method: 'GET', credentials: 'include', params: payload },
  }))

  listCounted = useAPI<
    IFindAndCountRes<IResource>,
    IListReq<IResource> | undefined
  >((payload) => ({
    url: ROUTES.api.resources,
    options: {
      method: 'GET',
      credentials: 'include',
      params: { ...payload, count: true },
    },
  }))

  read = useAPI<IResource, IResource['id']>((payload) => ({
    url: ROUTES.api.resource(payload),
    options: { method: 'GET', credentials: 'include' },
  }))

  update = useAPI<boolean, IUpdateReq<IResource>>((payload) => ({
    url: ROUTES.api.resource(payload.id),
    options: { method: 'PATCH', credentials: 'include', body: payload.fields },
  }))

  delete = useAPI<boolean, IResource['id'][]>((payload) => ({
    url: ROUTES.api.resources,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))
}

const resourcesApi = new ResourcesApi()
export default resourcesApi
