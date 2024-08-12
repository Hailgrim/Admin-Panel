export default defineNuxtPlugin((nuxtApp) => {
  const event = useRequestEvent()
  const config = useRuntimeConfig()
  const cookie = useRequestHeader('cookie')
  const baseURL = import.meta.client
    ? `https://api.${config.public.NGINX_HOST}`
    : `http://${config.public.NEST_CORE_HOST}:${config.public.NEST_CORE_PORT}`
  const timeout = 5000

  const api = $fetch.create({
    mode: 'cors',
    baseURL,
    timeout,
    retry: 1,
    retryDelay: 0,
    retryStatusCodes: [401],
    onRequest({ options }) {
      if (import.meta.server && cookie) {
        const headers = (options.headers ||= {})

        if (Array.isArray(headers)) {
          headers.push(['cookie', cookie])
        } else if (headers instanceof Headers) {
          headers.set('cookie', cookie)
        } else {
          headers.cookie = cookie
        }
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
        } catch (error) {
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
