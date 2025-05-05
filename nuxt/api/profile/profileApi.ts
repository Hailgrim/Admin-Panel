import { useAPI } from '~/composables/useAPI/useAPI'
import type {
  IChangeEmail,
  IChangeEmailRequest,
  IExternalSession,
  IUpdatePassword,
} from './types'
import type { IUser, TUpdateUser } from '../users/types'
import type { IQueryItems } from '../types'

class ProfileApi {
  getProfile = useAPI<IUser>(() => ({
    url: ROUTES.api.profile,
    options: { method: 'GET', credentials: 'include' },
  }))

  updateProfile = useAPI<boolean, TUpdateUser>((payload) => ({
    url: ROUTES.api.profile,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  updatePassword = useAPI<boolean, IUpdatePassword>((payload) => ({
    url: ROUTES.api.updatePassword,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  changeEmailRequest = useAPI<boolean, IChangeEmailRequest>((payload) => ({
    url: ROUTES.api.changeEmail,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  changeEmail = useAPI<boolean, IChangeEmail>((payload) => ({
    url: ROUTES.api.changeEmail,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  getSessions = useAPI<IExternalSession[]>(() => ({
    url: ROUTES.api.sessions,
    options: { method: 'GET', credentials: 'include' },
  }))

  deleteSessions = useAPI<boolean, IQueryItems<IExternalSession['id']>>(
    (payload) => ({
      url: ROUTES.api.sessions,
      options: { method: 'DELETE', credentials: 'include', body: payload },
    })
  )
}

const profileApi = new ProfileApi()
export default profileApi
