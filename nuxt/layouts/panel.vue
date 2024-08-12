<script setup lang="ts">
import '~/assets/styles.scss'
import SideBar from '~/components/widgets/SideBar/SideBar.vue'
import Alerts from '~/components/widgets/Alerts/Alerts.vue'
import { useMainStore } from '~/store/main/main'
import authApi from '~/api/auth/authApi'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const title = computed(() => route.meta.title ? t(String(route.meta.title)) : '?')
const description = computed(() => route.meta.description ? t(String(route.meta.description)) : '')
const name = computed(() => route.meta.name ? t(String(route.meta.name)) : '?')
const mainStore = useMainStore()
const loading = ref(false)
const { data, execute, pending } = authApi.signOut()

router.beforeEach(() => loading.value = true)
router.afterEach(() => loading.value = false)

watch(
  data,
  () => {
    if (data.value === true)
      mainStore.setProfile(null)
  },
)

watch(
  () => mainStore.profile,
  () => {
    if (mainStore.profile === null)
      router.push(ROUTES.ui.signIn)
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
color="error" icon="mdi-logout" :loading="pending || Boolean(data)" :title="$t('signOut')"
            @click="execute()" />
        </template>
      </v-app-bar>
      <v-main class="d-flex flex-column">
        <v-divider class="divider" />
        <v-card-title class="px-6 pt-3 pb-6" tag="h1">
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
