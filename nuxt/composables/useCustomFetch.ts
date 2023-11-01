import type { UnwrapRef } from 'nuxt/dist/app/compat/capi'
import { appendResponseHeader } from 'h3'

import type { ICookies, IRequestError } from '~/utils/types'

export function useCustomFetch<ResT extends NonNullable<unknown>, ReqT extends NonNullable<unknown> | void>(
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
  const config = useRuntimeConfig()
  const accessTokenName = `${config.public.PROJECT_TAG}_accessToken`
  const accessToken = useCookie(accessTokenName)
  const refreshTokenName = `${config.public.PROJECT_TAG}_refreshToken`
  const refreshToken = useCookie(refreshTokenName)
  const rememberMeName = `${config.public.PROJECT_TAG}_rememberMe`
  const rememberMe = useCookie(rememberMeName)
  const event = useRequestEvent()
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
      return undefined

    const refreshOptions: any = {
      method: 'GET',
      credentials: 'include',
      headers: process.server
        ? {
            Cookie: `${refreshTokenName}=${refreshToken.value}`
              .concat(rememberMe.value ? `;${rememberMeName}=true` : ''),
          }
        : undefined,
    }

    try {
      const res = await $fetch.raw<UnwrapRef<ICookies | undefined>>(
        ROUTES.api.auth.refresh,
        { ...defaultOptions, ...refreshOptions },
      )
      if (process.server) {
        const cookies = (res.headers.get('set-cookie') || '').split(',')
        for (const cookie of cookies)
          appendResponseHeader(event, 'set-cookie', cookie)
      }
      return await res.json().then(data => data.accessToken)
    }
    catch {
      return undefined
    }
  }

  async function customFetch(arg: UnwrapRef<ReqT>) {
    const query = init(arg)
    pending.value = true

    return $fetch<UnwrapRef<ResT>>(
      query.url,
      {
        ...defaultOptions,
        ...query.options,
        headers: {
          'Content-Type': typeof arg === 'object'
            ? 'application/json'
            : 'text/plain;charset=UTF-8',
          ...process.server && accessToken.value
            ? { Cookie: `${accessTokenName}=${accessToken.value}` }
            : undefined,
        },
      },
    )
      .then((resolve) => {
        error.value = null
        data.value = resolve
        pending.value = false
      })
      .catch(async (reject) => {
        const fetchError: IRequestError = { status: Number(reject.status) || 400, message: reject.message }

        // Trying to refresh tokens and refetch query
        if (fetchError.status === 401 && refreshed.value === false) {
          refreshed.value = true
          const newAccessToken = await refreshTokens()
          if (newAccessToken) {
            if (process.server)
              accessToken.value = newAccessToken
            customFetch(arg)
            return
          }
        }

        error.value = fetchError
        pending.value = false
      })
  }

  async function execute(arg: UnwrapRef<ReqT>) {
    if (payload.value === arg && error.value === null)
      return
    return refresh(arg)
  }

  async function refresh(arg: UnwrapRef<ReqT>) {
    refreshed.value = false
    payload.value = arg
    return customFetch(arg)
  }

  return { pending, error, data, execute, refresh }
}
