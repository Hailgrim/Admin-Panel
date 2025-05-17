class UsersApi {
  create = useAPI<IUser, TCreateUser>(payload => ({
    url: ROUTES.api.users,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  getOne = useAPI<IUser, IUser['id']>(payload => ({
    url: ROUTES.api.user(payload),
    options: { method: 'GET', credentials: 'include' },
  }))

  getList = useAPI<
    IGetListResponse<IUser>,
    TGetListRequest<TGetUsers> | undefined
  >(payload => ({
    url: ROUTES.api.users,
    options: { method: 'GET', credentials: 'include', params: payload },
  }))

  update = useAPI<undefined, IUpdateReq<TUpdateUser, IUser['id']>>(payload => ({
    url: ROUTES.api.user(payload.id),
    options: { method: 'PATCH', credentials: 'include', body: payload.fields },
  }))

  updateRoles = useAPI<undefined, IUpdateReq<IQueryItems<IUsersRoles>, IUser['id']>>(
    payload => ({
      url: ROUTES.api.userRoles(payload.id),
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      },
    }),
  )

  delete = useAPI<undefined, IQueryItems<IUser['id']>>(payload => ({
    url: ROUTES.api.users,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))
}

const usersApi = new UsersApi()
export default usersApi
