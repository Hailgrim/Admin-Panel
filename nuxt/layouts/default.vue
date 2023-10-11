<script setup lang="ts">
import SideBar from '~/components/Layout/SideBar.vue'

const { t } = useI18n()
const route = useRoute()
const title = computed(() => t(String(route.meta.title || '?')))
const description = computed(() => t(String(route.meta.description || '')))
const name = computed(() => t(String(route.meta.name || '?')))
</script>

<template>
  <Head>
    <Title>{{ title }} - {{ $t('adminPanel') }}</Title>
    <Meta :content="description" name="description" />
  </Head>
  <v-card>
    <v-layout>
      <SideBar />
      <v-main class="content">
        <v-app-bar density="comfortable" :flat="true">
          <v-app-bar-title tag="h1">
            {{ name }}
          </v-app-bar-title>
        </v-app-bar>
        <v-divider />
        <v-card :flat="true" class="pa-4">
          <slot />
        </v-card>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped>
.content {
  min-height: 100vh;
}
</style>
