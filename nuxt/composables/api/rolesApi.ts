class RolesApi {
  create = (payload: TFetchPayload<TCreateRole>) =>
    useAPI<IRole>(ROUTES.api.roles, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  getOne = (payload: TFetchPayload<IRole['id']>) =>
    useAPI<IRole>(() => ROUTES.api.role(unref(payload)), {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  getList = (payload?: TFetchPayload<TGetListRequest<TGetRoles>>) =>
    useAPI<IGetListResponse<IRole>>(ROUTES.api.roles, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
      params: payload,
    })

  update = (payload: TFetchPayload<IUpdateReq<TUpdateRole, IRole['id']>>) =>
    useAPI(() => ROUTES.api.role(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  updateRights = (payload: TFetchPayload<IUpdateReq<IQueryItems<IRights>, IRole['id']>>) =>
    useAPI(() => ROUTES.api.roleRights(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  delete = (payload: TFetchPayload<IQueryItems<IRole['id']>>) =>
    useAPI(ROUTES.api.roles, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    })
}

const rolesApi = new RolesApi()
export default rolesApi
