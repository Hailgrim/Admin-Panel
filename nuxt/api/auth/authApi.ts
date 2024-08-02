import { useAPI } from '~/composables/useAPI/useAPI'
import type {
  IResetPassword,
  ISession,
  IUserSignIn,
  IUserSignUp,
  IVerifyUser,
} from './types'
import type { IUser } from '../users/types'

class AuthApi {
  signUp = useAPI<IUser, IUserSignUp>((payload) => ({
    url: ROUTES.api.auth.sighUp,
    options: { method: 'POST', body: payload },
  }))

  forgotPassword = useAPI<boolean, string>((payload) => ({
    url: ROUTES.api.auth.forgotPassword,
    options: { method: 'POST', body: payload },
  }))

  resetPassword = useAPI<boolean, IResetPassword>((payload) => ({
    url: ROUTES.api.auth.resetPassword,
    options: { method: 'POST', body: payload },
  }))

  signIn = useAPI<IUser, IUserSignIn>((payload) => ({
    url: ROUTES.api.auth.signIn,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  verify = useAPI<boolean, IVerifyUser>((payload) => ({
    url: ROUTES.api.auth.verify,
    options: { method: 'POST', body: payload },
  }))

  getProfile = useAPI<IUser>(() => ({
    url: ROUTES.api.auth.profile,
    options: { method: 'GET', credentials: 'include' },
  }))

  updateProfile = useAPI<boolean, Partial<IUser>>((payload) => ({
    url: ROUTES.api.auth.profile,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  getSessions = useAPI<ISession[]>(() => ({
    url: ROUTES.api.auth.sessions,
    options: { method: 'GET', credentials: 'include' },
  }))

  deleteSessions = useAPI<boolean, string[]>((payload) => ({
    url: ROUTES.api.auth.sessions,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))

  signOut = useAPI<boolean>(() => ({
    url: ROUTES.api.auth.signOut,
    options: { method: 'DELETE', credentials: 'include' },
  }))
}

const authApi = new AuthApi()
export default authApi
