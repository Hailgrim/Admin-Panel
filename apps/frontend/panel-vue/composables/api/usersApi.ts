class UsersApi {
  create = (payload: TFetchPayload<TCreateUser>) =>
    useAPI<IUser>(ROUTES.api.users, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  getOne = (payload: TFetchPayload<IUser['id']>) =>
    useAPI<IUser>(() => ROUTES.api.user(unref(payload)), {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  getList = (payload?: TFetchPayload<TGetListRequest<TGetUsers>>) =>
    useAPI<IGetListResponse<IUser>>(ROUTES.api.users, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
      params: payload,
    })

  update = (payload: TFetchPayload<IUpdateReq<TUpdateUser, IUser['id']>>) =>
    useAPI(() => ROUTES.api.user(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  updateRoles = (payload: TFetchPayload<IUpdateReq<IQueryItems<IUsersRoles>, IUser['id']>>) =>
    useAPI(() => ROUTES.api.userRoles(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  delete = (payload: TFetchPayload<IQueryItems<IUser['id']>>) =>
    useAPI(ROUTES.api.users, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    })
}

const usersApi = new UsersApi()
export default usersApi
