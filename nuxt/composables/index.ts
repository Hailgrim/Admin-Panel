import type { UnwrapRef } from 'nuxt/dist/app/compat/capi'
import { setCookie } from 'h3'

import type { ICookies, IRequestError } from '~/libs/types'
import { ROUTES } from '~/libs/constants'

/**
 * @param {string} url Request URL
 * @param {object} options Request options
 * @param {'get' | 'post' | 'put' | 'delete' | 'patch'} options.method Request method
 * @param {'include' | 'omit' | 'same-origin'} options.credentials Request credentials
 */
export function useCustomFetch<ResT extends NonNullable<unknown>, ReqT extends NonNullable<unknown> | void>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    credentials?: 'include' | 'omit' | 'same-origin'
  } = { method: 'GET', credentials: 'omit' },
) {
  const { isHydrating } = useNuxtApp()
  const event = useRequestEvent()
  const config = useRuntimeConfig()
  const accessTokenName = `${config.public.PROJECT_TAG}_accessToken`
  const accessToken = useCookie(accessTokenName)
  const refreshTokenName = `${config.public.PROJECT_TAG}_refreshToken`
  const refreshToken = useCookie(refreshTokenName)
  const sessionIdName = `${config.public.PROJECT_TAG}_sessionId`
  const sessionId = useCookie(sessionIdName)
  const rememberMeName = `${config.public.PROJECT_TAG}_rememberMe`
  const rememberMe = useCookie(rememberMeName)

  const payload = ref<ReqT | null>(null)
  const pending = ref(false)
  const error = ref<IRequestError | null>(null)
  const data = ref<ResT | null>(null)
  const refreshed = ref(false)

  const queryOptions: any = {
    baseURL: isHydrating
      ? `https://api.${config.public.NGINX_HOST}`
      : `http://${config.public.NEST_CORE_HOST}:${config.public.NEST_CORE_PORT}`,
    mode: 'cors',
    timeout: 5000,
    headers: {
      Cookie: !isHydrating && refreshToken.value
        ? `${refreshTokenName}=${refreshToken.value}`
          .concat(accessToken.value ? `;${accessTokenName}=${accessToken.value}` : '')
          .concat(rememberMe.value ? `;${config.public.PROJECT_TAG}_rememberMe=true` : '')
        : undefined,
    },
  }

  const cookieOptions: object = {
    domain: `.${config.public.NGINX_HOST}`,
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
  }

  async function refreshTokens() {
    return $fetch<UnwrapRef<ICookies | undefined>>(
      ROUTES.api.auth.refresh,
      {
        ...queryOptions,
        method: 'GET',
        credentials: 'include',
      },
    )
  }

  async function customFetch(arg: UnwrapRef<ReqT>) {
    pending.value = true
    error.value = null
    data.value = null
    queryOptions.headers['Content-Type'] = typeof arg === 'object' ? 'application/json' : 'text/plain;charset=UTF-8'
    return $fetch<UnwrapRef<ResT>>(
      url,
      {
        ...queryOptions,
        method: options.method,
        credentials: options.credentials,
        body: options.method !== 'GET' && arg ? arg : undefined,
        params: options.method === 'GET' && arg ? arg : undefined,
      },
    )
      .then((resolve) => {
        pending.value = false
        data.value = resolve
      })
      .catch(async (reject) => {
        const fetchError: IRequestError = { status: Number(reject.status) || 400, message: reject.message }

        // Trying to refresh tokens and refetch query
        if (fetchError.status === 401 && refreshed.value === false && url !== ROUTES.api.auth.refresh) {
          refreshed.value = true
          try {
            const cookies = await refreshTokens()
            if (cookies) {
              if (cookies.accessToken) {
                setCookie(
                  event,
                  accessTokenName,
                  cookies.accessToken,
                  { ...cookieOptions, maxAge: Number(config.public.ACCESS_TOKEN_LIFETIME) },
                )
              }

              if (cookies.refreshToken) {
                setCookie(
                  event,
                  refreshTokenName,
                  cookies.refreshToken,
                  {
                    ...cookieOptions,
                    maxAge: rememberMe ? Number(config.public.REFRESH_TOKEN_LIFETIME) : Number(config.public.ACCESS_TOKEN_LIFETIME) * 2,
                  },
                )
              }

              if (sessionId.value) {
                setCookie(
                  event,
                  sessionIdName,
                  sessionId.value,
                  {
                    ...cookieOptions,
                    maxAge: rememberMe ? Number(config.public.REFRESH_TOKEN_LIFETIME) : Number(config.public.ACCESS_TOKEN_LIFETIME) * 2,
                  },
                )
              }

              if (rememberMe.value) {
                setCookie(
                  event,
                  rememberMeName,
                  rememberMe.value,
                  {
                    ...cookieOptions,
                    maxAge: rememberMe ? Number(config.public.REFRESH_TOKEN_LIFETIME) : Number(config.public.ACCESS_TOKEN_LIFETIME) * 2,
                  },
                )
              }

              customFetch(arg)
              return
            }
          }
          catch {}
        }

        pending.value = false
        error.value = fetchError
      })
  }

  async function execute(arg: UnwrapRef<ReqT>) {
    refreshed.value = false
    if (payload.value === arg && error.value === null)
      return
    payload.value = arg
    return customFetch(arg)
  }

  async function refresh(arg: UnwrapRef<ReqT>) {
    refreshed.value = false
    payload.value = arg
    return customFetch(arg)
  }

  return { pending, error, data, execute, refresh }
}
