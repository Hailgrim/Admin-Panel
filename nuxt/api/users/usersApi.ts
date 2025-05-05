import { useAPI } from '~/composables/useAPI/useAPI'
import type { IUser, TCreateUser, TGetUsers, TUpdateUser } from './types'
import type {
  IGetListResponse,
  TGetListRequest,
  IUpdateReq,
  IUsersRoles,
  IQueryItems,
} from '../types'

class UsersApi {
  create = useAPI<IUser, TCreateUser>((payload) => ({
    url: ROUTES.api.users,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  findAll = useAPI<
    IGetListResponse<IUser>,
    TGetListRequest<TGetUsers> | undefined
  >((payload) => ({
    url: ROUTES.api.users,
    options: { method: 'GET', credentials: 'include', params: payload },
  }))

  findOne = useAPI<IUser, IUser['id']>((payload) => ({
    url: ROUTES.api.user(payload),
    options: { method: 'GET', credentials: 'include' },
  }))

  update = useAPI<boolean, IUpdateReq<TUpdateUser, IUser['id']>>((payload) => ({
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

  delete = useAPI<boolean, IQueryItems<IUser['id']>>((payload) => ({
    url: ROUTES.api.users,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))
}

const usersApi = new UsersApi()
export default usersApi
