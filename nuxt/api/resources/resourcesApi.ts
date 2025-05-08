import { useAPI } from '~/composables/useAPI/useAPI'
import type { IUpdateReq } from '../types'

class ResourcesApi {
  create = useAPI<IResource, TCreateResource>((payload) => ({
    url: ROUTES.api.resources,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  getOne = useAPI<IResource, IResource['id']>((payload) => ({
    url: ROUTES.api.resource(payload),
    options: { method: 'GET', credentials: 'include' },
  }))

  getList = useAPI<
    IGetListResponse<IResource>,
    TGetListRequest<TGetResources> | undefined
  >((payload) => ({
    url: ROUTES.api.resources,
    options: { method: 'GET', credentials: 'include', params: payload },
  }))

  update = useAPI<boolean, IUpdateReq<TUpdateResource, IResource['id']>>(
    (payload) => ({
      url: ROUTES.api.resource(payload.id),
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      },
    })
  )

  delete = useAPI<boolean, IQueryItems<IResource['id']>>((payload) => ({
    url: ROUTES.api.resources,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))
}

const resourcesApi = new ResourcesApi()
export default resourcesApi
