import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.client)
    return

  const config = useRuntimeConfig()
  const refreshToken = useCookie(`${config.public.PROJECT_TAG}_refreshToken`)
  const authStore = useAuthStore()

  if (refreshToken.value) {
    try {
      await authStore.getProfile()
    }
    catch {}
  }

  if (authStore.profile) {
    if (Object.values(ROUTES.auth).includes(to.path)) {
      return navigateTo(
        { path: ROUTES.panel.home },
        { redirectCode: 302 },
      )
    }
  }
  else {
    if (Object.values(ROUTES.panel).includes(to.path)) {
      return navigateTo(
        { path: ROUTES.auth.signIn, query: { return: encodeURIComponent(to.path) } },
        { redirectCode: 401 },
      )
    }
  }
})
