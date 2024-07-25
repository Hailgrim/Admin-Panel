import { useAPI } from '~/composables/useAPI/useAPI'
import type { IUser, IUserCreate } from './types'
import type { IUsersRoles } from '../roles/types'
import type { IFindAndCountRes, IListReq, IUpdateReq } from '../types'

class UsersApi {
  create = useAPI<IUser, IUserCreate>((payload) => ({
    url: ROUTES.api.users,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  list = useAPI<IUser[], IListReq<IUser> | undefined>((payload) => ({
    url: ROUTES.api.users,
    options: { method: 'GET', credentials: 'include', params: payload },
  }))

  listCounted = useAPI<IFindAndCountRes<IUser>, IListReq<IUser> | undefined>(
    (payload) => ({
      url: ROUTES.api.users,
      options: {
        method: 'GET',
        credentials: 'include',
        params: { ...payload, count: true },
      },
    })
  )

  read = useAPI<IUser, IUser['id']>((payload) => ({
    url: ROUTES.api.user(payload),
    options: { method: 'GET', credentials: 'include' },
  }))

  update = useAPI<boolean, IUpdateReq<IUser>>((payload) => ({
    url: ROUTES.api.user(payload.id),
    options: { method: 'PATCH', credentials: 'include', body: payload.fields },
  }))

  updateRoles = useAPI<boolean, IUpdateReq<IUsersRoles[], IUser['id']>>(
    (payload) => ({
      url: ROUTES.api.userRoles(payload.id),
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      },
    })
  )

  delete = useAPI<boolean, IUser['id'] | IUser['id'][]>((payload) => ({
    url: ROUTES.api.users,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))
}

const usersApi = new UsersApi()
export default usersApi
