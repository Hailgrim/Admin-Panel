import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.client)
    return

  const accessToken = useCookie('accessToken')
  const authStore = useAuthStore()
  if (accessToken.value) {
    // Attempt to authorize the user
    await authStore.getProfile()
  }

  if (authStore.profile) {
    if (Object.values(ROUTES.auth).includes(to.path)) {
      return navigateTo(
        { path: to.query.return ? decodeURIComponent(String(to.query.return)) : ROUTES.panel.home },
        { redirectCode: 302 },
      )
    }
  }
  else {
    if (!Object.values(ROUTES.auth).includes(to.path)) {
      return navigateTo(
        { path: ROUTES.auth.signIn, query: { return: encodeURIComponent(to.path) } },
        { redirectCode: 401 },
      )
    }
  }
})
