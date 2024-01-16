<script setup lang="ts">
import '~/assets/styles.scss'
import SideBar from '~/components/SideBar/SideBar.vue'
import Alerts from '~/components/Other/Alerts.vue'
import { useMainStore } from '~/stores/main'
import { useAuthStore } from '~/stores/auth'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const title = computed(() => route.meta.title ? t(String(route.meta.title)) : '?')
const description = computed(() => route.meta.description ? t(String(route.meta.description)) : '')
const name = computed(() => route.meta.name ? t(String(route.meta.name)) : '?')
const mainStore = useMainStore()
const authStore = useAuthStore()
const loading = ref(false)

router.beforeEach(() => loading.value = true)
router.afterEach(() => loading.value = false)

watch(
  () => authStore.profile,
  () => {
    if (authStore.profile === null)
      router.push(ROUTES.auth.signIn)
  },
)
</script>

<template>
  <Head>
    <Title>{{ title }} - {{ $t('adminPanel') }}</Title>
    <Meta :content="description" name="description" />
  </Head>
  <v-card :loading="loading">
    <v-layout class="content">
      <SideBar />
      <v-app-bar density="comfortable" :flat="true">
        <template #prepend>
          <v-app-bar-nav-icon @click="mainStore.toggleSideBar(!mainStore.isSideBarOpened)" />
        </template>
        <template #append>
          <v-app-bar-nav-icon
            icon="mdi-logout" color="error" :title="$t('signOut')"
            :loading="Boolean(authStore.signOutPending || authStore.signOutData)" @click="authStore.signOut()"
          />
        </template>
      </v-app-bar>
      <v-main class="d-flex flex-column">
        <v-divider class="divider" />
        <v-card-title tag="h1" class="px-6 pt-3 pb-6">
          {{ name }}
        </v-card-title>
        <v-card-text class="px-6 py-0 d-flex flex-column">
          <slot />
        </v-card-text>
      </v-main>
    </v-layout>
    <Alerts />
  </v-card>
</template>

<style scoped lang="scss">
.content {
  min-height: 100vh;

  .divider {
    position: fixed;
    width: 100%;
  }
}
</style>
