export default defineNuxtPlugin((nuxtApp) => {
  const event = useRequestEvent()
  const config = useRuntimeConfig()
  const cookie = useRequestHeader('cookie')
  const userAgent = useRequestHeader('user-agent')
  const baseURL = import.meta.client
    ? config.public.EXTERNAL_API_HOST
    : config.public.INTERNAL_API_HOST
  const timeout = 5000

  const api = $fetch.create({
    mode: 'cors',
    baseURL,
    timeout,
    retry: 1,
    retryDelay: 0,
    retryStatusCodes: [401],
    onRequest({ options }) {
      const newHeaders: Map<string, string> = new Map()

      if (import.meta.server && cookie) {
        newHeaders.set('cookie', cookie)
      }

      if (typeof options.body === 'object') {
        newHeaders.set('content-type', 'application/json')
      } else {
        newHeaders.set('content-type', 'text/plain;charset=UTF-8')
      }

      if (userAgent) {
        newHeaders.set('user-agent', userAgent)
      }

      const headers = (options.headers ||= {})
      if (Array.isArray(headers)) {
        newHeaders.forEach((value, key) => headers.push([key, value]))
      } else if (headers instanceof Headers) {
        newHeaders.forEach((value, key) => headers.set(key, value))
      } else {
        newHeaders.forEach((value, key) => (headers[key] = value))
      }
    },
    async onResponseError({ response, options }) {
      if (response.status === 401) {
        try {
          const refresh = await $fetch.raw<boolean>(ROUTES.api.refresh, {
            baseURL,
            method: 'GET',
            headers: options.headers,
            mode: 'cors',
            credentials: 'include',
            timeout,
          })
          const newCookies = refresh.headers.get('set-cookie')

          if (newCookies) {
            if (import.meta.server && event) {
              newCookies
                .split(', ')
                .map((cookie) =>
                  event.node.res.appendHeader('set-cookie', cookie)
                )
            }
          }
        } catch {
          if (!Object.values(ROUTES.ui).includes(nuxtApp._route.path)) {
            await nuxtApp.runWithContext(() =>
              navigateTo(
                {
                  path: ROUTES.ui.signIn,
                  query: { return: encodeURIComponent(nuxtApp._route.path) },
                },
                { redirectCode: 302 }
              )
            )
          }
        }
      } else {
        throw response._data
      }
    },
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  }
})
