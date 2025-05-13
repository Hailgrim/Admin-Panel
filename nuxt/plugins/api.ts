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
      if (import.meta.client) {
        return
      }

      if (cookie) {
        options.headers.set('cookie', cookie)
      }

      if (userAgent) {
        options.headers.set('user-agent', userAgent)
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

          if (import.meta.server && event && newCookies) {
            newCookies
              .split(', ')
              .map(cookie =>
                event.node.res.appendHeader('set-cookie', cookie),
              )
          }
        }
        catch {
          if (
            !Object.values(ROUTES.ui).some(
              route => typeof route === 'string' && route.includes(nuxtApp._route.path),
            )
          ) {
            await nuxtApp.runWithContext(() =>
              navigateTo(
                {
                  path: ROUTES.ui.signIn,
                  query: { return: encodeURIComponent(nuxtApp._route.path) },
                },
                { redirectCode: 302 },
              ),
            )
          }
        }
      }
    },
  })

  // NOTE: Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  }
})
