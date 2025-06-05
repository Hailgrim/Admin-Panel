<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const config = useRuntimeConfig()
const timeout = ref<NodeJS.Timeout>()

const googleHandler = (event: MouseEvent) => {
  event.preventDefault()

  const message: IWindowMessage<string> = {
    type: ROUTES.ui.signInGoogle,
    payload: String(Math.random()),
  }
  const googleWindow = window.open(
    getGoogleSignInUrl(config.public.googleClientId, config.public.host, message.payload),
    undefined,
    'top=100,left=100,width=500,height=500',
  )

  clearTimeout(timeout.value)
  timeout.value = setInterval(() => {
    googleWindow?.postMessage(message)
  }, 1000)
}

const messageHandler = (event: MessageEvent<IWindowMessage<IUser>>) => {
  if (event.data.type !== ROUTES.ui.signInGoogle) {
    return
  }

  mainStore.setProfile(event.data.payload)
  router.push(route.query.return ? decodeURIComponent(String(route.query.return)) : ROUTES.ui.home)
}

onMounted(() => {
  window.addEventListener('message', messageHandler)
})

onUnmounted(() => {
  window.removeEventListener('message', messageHandler)
  clearTimeout(timeout.value)
})
</script>

<template>
  <FormLink
    event=""
    :href="ROUTES.ui.signInGoogle"
    :text="$t('signInWithGoogle')"
    @click="googleHandler"
  />
</template>
