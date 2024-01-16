import type { UnwrapRef } from 'nuxt/dist/app/compat/capi'
import { appendResponseHeader } from 'h3'

import type { IRequestError } from '~/utils/types'

export function useCustomFetch<
  ResT extends NonNullable<unknown>,
  ReqT extends NonNullable<unknown> | void,
>(
  init: (payload: UnwrapRef<ReqT>) => {
    url: string
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      params?: any
      body?: any
      credentials?: 'include' | 'omit' | 'same-origin'
    }
  },
) {
  const event = useRequestEvent()
  const config = useRuntimeConfig()
  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')
  const rememberMe = useCookie('rememberMe')
  const payload = ref<ReqT | null>(null)
  const pending = ref(false)
  const error = ref<IRequestError | null>(null)
  const data = ref<ResT | null>(null)
  const refreshed = ref(false)

  const defaultOptions: object = {
    mode: 'cors',
    timeout: 5000,
    baseURL: process.client
      ? `https://api.${config.public.NGINX_HOST}`
      : `http://${config.public.NEST_CORE_HOST}:${config.public.NEST_CORE_PORT}`,
  }

  async function refreshTokens() {
    if (process.server && !refreshToken.value)
      return null

    const refreshOptions: any = {
      method: 'GET',
      credentials: 'include',
      headers: process.server
        ? {
            Cookie: `refreshToken=${refreshToken.value}`.concat(
              rememberMe.value ? ';rememberMe=true' : '',
            ),
          }
        : undefined,
    }

    try {
      const res = await $fetch.raw<UnwrapRef<boolean>>(
        ROUTES.api.auth.refresh,
        { ...defaultOptions, ...refreshOptions },
      )
      if (process.server) {
        const cookies = (res.headers.get('set-cookie') || '').split(',')
        for (const cookie of cookies)
          appendResponseHeader(event, 'set-cookie', cookie)
      }
      return res._data
    }
    catch {
      return null
    }
  }

  async function customFetch(
    arg: UnwrapRef<ReqT>,
  ): Promise<UnwrapRef<ResT> | null> {
    const query = init(arg)
    pending.value = true

    try {
      const resolve = await $fetch<UnwrapRef<ResT>>(query.url, {
        ...defaultOptions,
        ...query.options,
        headers: {
          'Content-Type':
            typeof arg === 'object'
              ? 'application/json'
              : 'text/plain;charset=UTF-8',
          ...(process.server && accessToken.value
            ? { Cookie: `accessToken=${accessToken.value}` }
            : undefined),
        },
      })

      error.value = null
      data.value = resolve
      pending.value = false
      return resolve
    }
    catch (fail) {
      const fetchError: IRequestError = {
        status: Number((fail as any).status) || 400,
        message: (fail as any).message,
      }

      // Trying to refresh tokens and refetch query
      if (fetchError.status === 401 && refreshed.value === false) {
        refreshed.value = true
        const success = await refreshTokens()
        if (success)
          return customFetch(arg)
      }

      error.value = fetchError
      pending.value = false
      return null
    }
  }

  async function execute(arg: UnwrapRef<ReqT>) {
    if (payload.value === arg && error.value === null)
      return data.value
    return refresh(arg)
  }

  async function refresh(arg: UnwrapRef<ReqT>) {
    refreshed.value = false
    payload.value = arg
    return customFetch(arg)
  }

  return { pending, error, data, execute, refresh }
}
