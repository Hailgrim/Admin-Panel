import type { IReqError } from './types'

export function useAPI<ResT = unknown, ReqT = void>(
  initQuery: (payload: ReqT) => {
    url: string
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      params?: Record<string, unknown>
      body?: unknown
      credentials?: RequestCredentials
    }
  },
) {
  return (cacheKey?: string) => {
    const mainStore = useMainStore()
    const customFetch = useNuxtApp().$api as typeof $fetch
    const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
    const error = ref<IReqError | null>(null)
    let cache = ref(null) as Ref<ResT | null>

    if (cacheKey) {
      const { data: nuxtData } = useNuxtData<ResT | null>(cacheKey)
      cache = nuxtData
    }

    const data = ref(cache.value)

    async function execute(arg: ReqT): Promise<ResT | null> {
      const query = initQuery(arg)
      const headers: HeadersInit = {}
      error.value = null
      data.value = null
      status.value = 'pending'

      try {
        const result = await customFetch<ResT>(query.url, {
          ...query.options,
          body: query.options.body as
          | BodyInit
          | Record<string, unknown>
          | null
          | undefined,
          headers,
        })

        cache.value = result
        data.value = result
        status.value = 'success'
      }
      catch (fail) {
        error.value = {
          status: Number((fail as Record<string, unknown>).statusCode) || 400,
          message: String((fail as Record<string, unknown>).message),
        }
        status.value = 'error'

        if (error.value.status === 401) {
          mainStore.setProfile(null)
        }
      }

      return data.value
    }

    return { data, error, status, execute }
  }
}
