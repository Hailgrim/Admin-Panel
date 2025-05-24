class ProfileApi {
  getProfile = () =>
    useAPI<IUser>(ROUTES.api.profile, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  updateProfile = (payload: TFetchPayload<TUpdateUser>) =>
    useAPI(ROUTES.api.profile, {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    })

  updatePassword = (payload: TFetchPayload<IUpdatePassword>) =>
    useAPI(ROUTES.api.updatePassword, {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    })

  changeEmailRequest = (payload: TFetchPayload<IChangeEmailRequest>) =>
    useAPI(ROUTES.api.changeEmail, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  changeEmailConfirm = (payload: TFetchPayload<IChangeEmailConfirm>) =>
    useAPI(ROUTES.api.changeEmail, {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    })

  getSessions = () =>
    useAPI<IExternalSession[]>(ROUTES.api.sessions, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  deleteSessions = (payload: TFetchPayload<IQueryItems<IExternalSession['id']>>) =>
    useAPI(ROUTES.api.sessions, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    })
}

const profileApi = new ProfileApi()
export default profileApi
