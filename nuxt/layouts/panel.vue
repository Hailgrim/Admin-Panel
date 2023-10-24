<script setup lang="ts">
import SideBar from '~/components/Layout/SideBar.vue'
import Alerts from '~/components/Other/Alerts.vue'
import { ROUTES } from '~/libs/constants'
import { useMainStore } from '~/stores/main'
import { useProfileStore } from '~/stores/profile'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const title = computed(() => route.meta.title ? t(String(route.meta.title)) : '?')
const description = computed(() => route.meta.description ? t(String(route.meta.description)) : '')
const name = computed(() => route.meta.name ? t(String(route.meta.name)) : '?')
const mainStore = useMainStore()
const profileStore = useProfileStore()

watch(
  () => profileStore.profile,
  () => {
    if (profileStore.profile === null)
      router.push(ROUTES.auth.signIn)
  },
)
</script>

<template>
  <Head>
    <Title>{{ title }} - {{ $t('adminPanel') }}</Title>
    <Meta :content="description" name="description" />
  </Head>
  <v-card>
    <v-layout class="content">
      <SideBar />
      <v-app-bar density="comfortable" :flat="true">
        <template #prepend>
          <v-app-bar-nav-icon @click="mainStore.toggleSideBar(!mainStore.isSideBarOpened)" />
        </template>
        <template #append>
          <v-app-bar-nav-icon
            icon="mdi-logout" color="error" :title="$t('signOut')"
            :loading="profileStore.signOutPending" @click="profileStore.signOut()"
          />
        </template>
      </v-app-bar>
      <v-main>
        <v-divider />
        <v-card-title tag="h1" class="px-6 py-3">
          {{ name }}
        </v-card-title>
        <v-card-text class="px-6 pt-0 pb-3">
          <slot />
        </v-card-text>
      </v-main>
    </v-layout>
    <Alerts />
  </v-card>
</template>

<style scoped>
.content {
  min-height: 100vh;
}
</style>
