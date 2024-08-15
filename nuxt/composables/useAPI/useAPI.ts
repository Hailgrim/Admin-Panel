import type { IReqError } from './types'

export function useAPI<ResT = unknown, ReqT = void>(
  initQuery: (payload: ReqT) => {
    url: string;
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      params?: Record<string, unknown>;
      body?: unknown;
      credentials?: RequestCredentials;
    };
  }
) {
  return (cacheKey?: string) => {
    const customFetch = useNuxtApp().$api
    const args = ref(null) as Ref<ReqT | null>
    const pending = ref(false)
    const error = ref<IReqError | null>(null)
    let cache = ref(null) as Ref<ResT | null>
    if (cacheKey) {
      const { data: nuxtData } = useNuxtData<ResT | null>(cacheKey)
      cache = nuxtData
    }
    const data = ref(cache.value) as Ref<ResT | null>

    async function execute(arg: ReqT): Promise<ResT | null> {
      const query = initQuery(arg)
      const headers: HeadersInit = {}
      error.value = null
      data.value = null
      pending.value = true
      args.value = arg

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
        pending.value = false
      } catch (fail) {
        error.value = {
          status: Number((fail as Record<string, unknown>).statusCode) || 400,
          message: String((fail as Record<string, unknown>).message),
        }
        pending.value = false
      }

      return data.value
    }

    return { data, error, pending, execute, args }
  }
}
