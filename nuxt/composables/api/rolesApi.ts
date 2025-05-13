class RolesApi {
  create = useAPI<IRole, TCreateRole>(payload => ({
    url: ROUTES.api.roles,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  getOne = useAPI<IRole, IRole['id']>(payload => ({
    url: ROUTES.api.role(payload),
    options: { method: 'GET', credentials: 'include' },
  }))

  getList = useAPI<
    IGetListResponse<IRole>,
    TGetListRequest<TGetRoles> | undefined
  >(payload => ({
    url: ROUTES.api.roles,
    options: { method: 'GET', credentials: 'include', params: payload },
  }))

  update = useAPI<boolean, IUpdateReq<TUpdateRole, IRole['id']>>(payload => ({
    url: ROUTES.api.role(payload.id),
    options: { method: 'PATCH', credentials: 'include', body: payload.fields },
  }))

  updateResources = useAPI<boolean, IUpdateReq<IRights[], IRole['id']>>(
    payload => ({
      url: ROUTES.api.roleResources(payload.id),
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      },
    }),
  )

  delete = useAPI<boolean, IQueryItems<IRole['id']>>(payload => ({
    url: ROUTES.api.roles,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))
}

const rolesApi = new RolesApi()
export default rolesApi
