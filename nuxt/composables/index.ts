import { type UnwrapRef } from 'nuxt/dist/app/compat/capi'

import type { ICookies, IRequestError } from '~/libs/types'

/**
 * @param {string} url Request URL
 * @param {object} options Request options
 * @param {'get' | 'post' | 'put' | 'delete' | 'patch'} options.method Request method
 * @param {'include' | 'omit' | 'same-origin'} options.credentials Request credentials
 */
export function useCustomFetch<ReturnT extends NonNullable<unknown>, PayloadT extends Record<string, any> | void>(
  url: string,
  options: {
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
    credentials?: 'include' | 'omit' | 'same-origin'
  } = { method: 'get', credentials: 'omit' },
) {
  const { isHydrating } = useNuxtApp()
  const config = useRuntimeConfig()
  const payload = ref<PayloadT | null>(null)
  const pending = ref<boolean>(false)
  const error = ref<IRequestError | null>(null)
  const data = ref<ReturnT | null>(null)
  const refreshed = ref<boolean>(false)

  // Refresh tokens request
  async function refreshTokens() {
    return $fetch<UnwrapRef<ICookies | undefined>>(
      'auth/refresh',
      {
        baseURL: isHydrating
          ? `https://api.${config.public.NGINX_HOST}`
          : `http://${config.public.NEST_CORE_HOST}:${config.public.NEST_CORE_PORT}`,
        method: 'get',
        credentials: 'include',
        mode: 'cors',
      },
    )
  }

  async function customFetch(arg: UnwrapRef<PayloadT>) {
    pending.value = true
    error.value = null
    data.value = null
    return $fetch<UnwrapRef<ReturnT>>(
      url,
      {
        baseURL: isHydrating
          ? `https://api.${config.public.NGINX_HOST}`
          : `http://${config.public.NEST_CORE_HOST}:${config.public.NEST_CORE_PORT}`,
        method: options.method,
        credentials: options.credentials,
        body: options.method !== 'get' && arg ? arg : undefined,
        params: options.method === 'get' && arg ? arg : undefined,
        mode: 'cors',
      },
    )
      .then((resolve) => {
        pending.value = false
        data.value = resolve
      })
      .catch(async (reject) => {
        const fetchError: IRequestError = { status: Number(reject.status) || 400, message: reject.message }
        // Trying to refresh tokens and refetch query
        if (fetchError.status === 401 && !refreshed.value) {
          refreshed.value = true
          try {
            const cookies = await refreshTokens()
            if (cookies) {
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

  async function execute(arg: UnwrapRef<PayloadT>) {
    refreshed.value = false
    if (payload.value !== arg) {
      payload.value = arg
      console.log('new', arg)
      console.log('payload2', payload.value)
      return customFetch(arg)
    }
    else {
      console.log('same', arg)
    }
  }

  async function refresh(arg: UnwrapRef<PayloadT>) {
    refreshed.value = false
    payload.value = arg
    return customFetch(arg)
  }

  return { pending, error, data, execute, refresh }
}
