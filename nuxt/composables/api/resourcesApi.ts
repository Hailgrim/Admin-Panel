class ResourcesApi {
  create = useAPI<IResource, TCreateResource>(payload => ({
    url: ROUTES.api.resources,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  getOne = useAPI<IResource, IResource['id']>(payload => ({
    url: ROUTES.api.resource(payload),
    options: { method: 'GET', credentials: 'include' },
  }))

  getList = useAPI<
    IGetListResponse<IResource>,
    TGetListRequest<TGetResources> | undefined
  >(payload => ({
    url: ROUTES.api.resources,
    options: { method: 'GET', credentials: 'include', params: payload },
  }))

  update = useAPI<undefined, IUpdateReq<TUpdateResource, IResource['id']>>(
    payload => ({
      url: ROUTES.api.resource(payload.id),
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      },
    }),
  )

  delete = useAPI<undefined, IQueryItems<IResource['id']>>(payload => ({
    url: ROUTES.api.resources,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))
}

const resourcesApi = new ResourcesApi()
export default resourcesApi
