class ProfileApi {
  getProfile = useAPI<IUser>(() => ({
    url: ROUTES.api.profile,
    options: { method: 'GET', credentials: 'include' },
  }))

  updateProfile = useAPI<undefined, TUpdateUser>(payload => ({
    url: ROUTES.api.profile,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  updatePassword = useAPI<undefined, IUpdatePassword>(payload => ({
    url: ROUTES.api.updatePassword,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  changeEmailRequest = useAPI<undefined, IChangeEmailRequest>(payload => ({
    url: ROUTES.api.changeEmail,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  changeEmailConfirm = useAPI<undefined, IChangeEmail>(payload => ({
    url: ROUTES.api.changeEmail,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))

  getSessions = useAPI<IExternalSession[]>(() => ({
    url: ROUTES.api.sessions,
    options: { method: 'GET', credentials: 'include' },
  }))

  deleteSessions = useAPI<undefined, IQueryItems<IExternalSession['id']>>(
    payload => ({
      url: ROUTES.api.sessions,
      options: { method: 'DELETE', credentials: 'include', body: payload },
    }),
  )
}

const profileApi = new ProfileApi()
export default profileApi
