<script setup lang="ts">
import { useMainStore } from '~/store/main/main'
import FormLink from '~/components/shared/ui/Form/FormLink.vue'
import { getGoogleSignInUrl } from './utils'
import type { IWindowMessage } from './types'
import type { IUser } from '~/api/users/types'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const timeout = ref<NodeJS.Timeout>()

const googleHandler = (event: MouseEvent) => {
  event.preventDefault()
  const state = String(Math.random())
  const googleWindow = window.open(
    getGoogleSignInUrl(state),
    undefined,
    'top=100,left=100,width=500,height=500'
  )
  clearTimeout(timeout.value)
  timeout.value = setInterval(() => {
    googleWindow?.postMessage(state)
  }, 1000)
}

const messageHandler = (event: MessageEvent<IWindowMessage<IUser>>) => {
  if (event.data.type !== ROUTES.ui.signInGoogle) return
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
  <FormLink event="" :href="ROUTES.ui.signInGoogle" :text="$t('signInWithGoogle')" @click="googleHandler" />
</template>