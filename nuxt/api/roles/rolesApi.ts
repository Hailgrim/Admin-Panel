import { useAPI } from '~/composables/useAPI/useAPI'
import type { IRole, IRoleCreate } from './types'
import type { IRolesResources } from '../resources/types'
import type { IFindAndCountRes, IListReq, IUpdateReq } from '../types'

class RolesApi {
  create = useAPI<IRole, IRoleCreate>((payload) => ({
    url: ROUTES.api.roles,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  list = useAPI<IRole[], IListReq<IRole> | undefined>((payload) => ({
    url: ROUTES.api.roles,
    options: { method: 'GET', credentials: 'include', params: payload },
  }))

  listCounted = useAPI<IFindAndCountRes<IRole>, IListReq<IRole> | undefined>(
    (payload) => ({
      url: ROUTES.api.roles,
      options: {
        method: 'GET',
        credentials: 'include',
        params: { ...payload, count: true },
      },
    })
  )

  read = useAPI<IRole, IRole['id']>((payload) => ({
    url: ROUTES.api.role(payload),
    options: { method: 'GET', credentials: 'include' },
  }))

  update = useAPI<boolean, IUpdateReq<IRole>>((payload) => ({
    url: ROUTES.api.role(payload.id),
    options: { method: 'PATCH', credentials: 'include', body: payload.fields },
  }))

  updateResources = useAPI<boolean, IUpdateReq<IRolesResources[], IRole['id']>>(
    (payload) => ({
      url: ROUTES.api.roleResources(payload.id),
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      },
    })
  )

  delete = useAPI<boolean, IRole['id'] | IRole['id'][]>((payload) => ({
    url: ROUTES.api.roles,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))
}

const rolesApi = new RolesApi()
export default rolesApi
