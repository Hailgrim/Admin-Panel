import type { UnwrapRef } from 'nuxt/dist/app/compat/capi'

import type { IRequestError } from '~/libs/types'

/**
 * @param {string} url Request URL
 * @param {object} options Request options
 * @param {'get' | 'post' | 'put' | 'delete' | 'patch'} options.method Request method
 * @param {'include' | 'omit' | 'same-origin'} options.credentials Request credentials
 */
export function useCustomFetch<ReturnT extends NonNullable<unknown>, PayloadT extends Record<string, any>>(
  url: string,
  options: {
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
    credentials?: 'include' | 'omit' | 'same-origin'
  } = { method: 'get', credentials: 'omit' },
) {
  const config = useRuntimeConfig()
  const payload = ref<PayloadT | null>(null)
  const pending = ref<boolean>(false)
  const error = ref<IRequestError | null>(null)
  const data = ref<ReturnT | null>(null)
  async function execute(arg: UnwrapRef<PayloadT>) {
    payload.value = arg
    pending.value = true
    error.value = null
    data.value = null
    await $fetch<UnwrapRef<ReturnT>>(
      url,
      {
        baseURL: document?.location?.host
          ? `https://api.${config.public.NGINX_HOST}`
          : `http://${config.public.NEST_CORE_HOST}:${config.public.NEST_CORE_PORT}`,
        method: options.method,
        credentials: options.credentials,
        body: options.method !== 'get' ? payload.value : undefined,
        params: options.method === 'get' ? payload.value : undefined,
      },
    )
      .then(resolve => data.value = resolve)
      .catch(reject => error.value = reject)
      .finally(() => pending.value = false)
  }
  return { pending, error, data, execute }
}
