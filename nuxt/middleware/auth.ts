import { ROUTES } from '~/libs/constants'
import { useProfileStore } from '~/stores/profile'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isHydrating } = useNuxtApp()
  if (isHydrating)
    return

  const config = useRuntimeConfig()
  const refreshToken = useCookie(`${config.public.PROJECT_TAG}_refreshToken`)
  const profileStore = useProfileStore()

  if (refreshToken.value) {
    try {
      await profileStore.getProfile()
    }
    catch {}
  }

  if (profileStore.profile) {
    if (Object.values(ROUTES.auth).includes(to.path))
      return navigateTo({ path: ROUTES.panel.home }, { redirectCode: 302 })
  }
  else {
    if (Object.values(ROUTES.panel).includes(to.path))
      return navigateTo({ path: ROUTES.auth.signIn }, { redirectCode: 401 })
  }
})
