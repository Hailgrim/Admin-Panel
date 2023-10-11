<script setup lang="ts">
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
    <v-layout class="mx-auto v-col-xl-3 v-col-lg-4 v-col-md-6 v-col-12">
      <v-main class="content d-flex flex-column align-center justify-center pa-5">
        <v-card-title tag="h1" class="flex-grow-0 pa-5">
          {{ name }}
        </v-card-title>
        <slot />
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped>
.content {
  min-height: 100vh;
}
</style>
