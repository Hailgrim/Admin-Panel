import { useAPI } from '~/composables/useAPI/useAPI'
import type { ISession, IUpdatePassword } from './types'
import type { IUser } from '../users/types'

class ProfileApi {
  getProfile = useAPI<IUser>(() => ({
    url: ROUTES.api.profile,
    options: { method: 'GET', credentials: 'include' },
  }))

  updateProfile = useAPI<boolean, Partial<IUser>>((payload) => ({
    url: ROUTES.api.profile,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  updatePassword = useAPI<boolean, IUpdatePassword>((payload) => ({
    url: ROUTES.api.updatePassword,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  changeEmailRequest = useAPI<boolean, string>((payload) => ({
    url: ROUTES.api.changeEmail,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  changeEmailConfirm = useAPI<boolean, string>((payload) => ({
    url: ROUTES.api.changeEmail,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  getSessions = useAPI<ISession[]>(() => ({
    url: ROUTES.api.sessions,
    options: { method: 'GET', credentials: 'include' },
  }))

  deleteSessions = useAPI<boolean, string[]>((payload) => ({
    url: ROUTES.api.sessions,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))
}

const profileApi = new ProfileApi()
export default profileApi
