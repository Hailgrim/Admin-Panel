export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) return

  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')
  const mainStore = useMainStore()
  const isAuthRoute
    = to.path === ROUTES.ui.signIn
      || to.path === ROUTES.ui.signInGoogle
      || to.path === ROUTES.ui.signUp
      || to.path === ROUTES.ui.forgotPassword

  if (accessToken.value || refreshToken.value) {
    // Attempt to authorize the user
    const { data, execute } = profileApi.getProfile()
    await execute()
    mainStore.setProfile(data.value)
  }

  if (mainStore.profile) {
    if (isAuthRoute) {
      return navigateTo(
        {
          path: to.query.return
            ? decodeURIComponent(String(to.query.return))
            : ROUTES.ui.home,
        },
        { redirectCode: 302 },
      )
    }
  }
  else {
    if (!isAuthRoute) {
      return navigateTo(
        {
          path: ROUTES.ui.signIn,
          query: { return: encodeURIComponent(to.path) },
        },
        { redirectCode: 302 },
      )
    }
  }
})
