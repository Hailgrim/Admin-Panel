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
  return () => {
    const pending = ref(false)
    const error = ref<IReqError | null>(null)
    const data = ref<ResT | null>(null) as Ref<ResT | null>
    const customFetch = useNuxtApp().$api
    const userAgent = useRequestHeader('user-agent')

    async function execute(arg: ReqT): Promise<ResT | null> {
      const query = initQuery(arg)
      const headers: HeadersInit = {}
      error.value = null
      data.value = null
      pending.value = true

      headers['content-type'] =
        typeof arg === 'object'
          ? 'application/json'
          : 'text/plain;charset=UTF-8'

      if (userAgent) {
        headers['user-agent'] = userAgent
      }

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

    return { data, error, pending, execute }
  }
}
