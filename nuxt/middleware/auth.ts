import authApi from '~/api/auth/authApi'
import { useMainStore } from '~/store/main/main'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) return

  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')
  const mainStore = useMainStore()

  if (accessToken.value || refreshToken.value) {
    // Attempt to authorize the user
    const { data, execute } = authApi.getProfile()
    await execute()
    mainStore.setProfile(data.value)
  }

  if (mainStore.profile) {
    if (Object.values(ROUTES.auth).includes(to.path)) {
      return navigateTo(
        {
          path: to.query.return
            ? decodeURIComponent(String(to.query.return))
            : ROUTES.panel.home,
        },
        { redirectCode: 302 }
      )
    }
  } else {
    if (!Object.values(ROUTES.auth).includes(to.path)) {
      return navigateTo(
        {
          path: ROUTES.auth.signIn,
          query: { return: encodeURIComponent(to.path) },
        },
        { redirectCode: 302 }
      )
    }
  }
})
