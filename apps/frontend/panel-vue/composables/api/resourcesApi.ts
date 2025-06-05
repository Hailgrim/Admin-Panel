class ResourcesApi {
  create = (payload: TFetchPayload<TCreateResource>) =>
    useAPI<IResource>(ROUTES.api.resources, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  getOne = (payload: TFetchPayload<IResource['id']>) =>
    useAPI<IResource>(() => ROUTES.api.resource(unref(payload)), {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
    })

  getList = (payload?: TFetchPayload<TGetListRequest<TGetResources>>) =>
    useAPI<IGetListResponse<IResource>>(ROUTES.api.resources, {
      immediate: false,
      watch: false,
      method: 'GET',
      credentials: 'include',
      params: payload,
    })

  update = (payload: TFetchPayload<IUpdateReq<TUpdateResource, IResource['id']>>) =>
    useAPI(() => ROUTES.api.resource(unref(unref(payload).id)), {
      immediate: false,
      watch: false,
      method: 'PATCH',
      credentials: 'include',
      body: unref(payload).fields,
    })

  delete = (payload: TFetchPayload<IQueryItems<IResource['id']>>) =>
    useAPI(ROUTES.api.resources, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    })
}

const resourcesApi = new ResourcesApi()
export default resourcesApi
