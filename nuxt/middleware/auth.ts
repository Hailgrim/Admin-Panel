import { ROUTES } from '~/libs/constants'

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  const refreshToken = useCookie(`${config.public.PROJECT_TAG}_refreshToken`)
  if (!refreshToken.value && Object.values(ROUTES.panel).includes(to.path))
    return navigateTo({ path: '/authorization' }, { redirectCode: 401 })
})
