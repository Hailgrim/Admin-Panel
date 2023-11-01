<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const title = computed(() => route.meta.title ? t(String(route.meta.title)) : '?')
const description = computed(() => route.meta.description ? t(String(route.meta.description)) : '')
const name = computed(() => route.meta.name ? t(String(route.meta.name)) : '?')
</script>

<template>
  <Head>
    <Title>{{ title }} - {{ $t('adminPanel') }}</Title>
    <Meta :content="description" name="description" />
  </Head>
  <v-card>
    <v-layout class="content flex-column align-stretch justify-center mx-auto v-col-xl-3 v-col-lg-4 v-col-md-6 v-col-12">
      <v-card-title tag="h1" class="flex-grow-0 text-center pb-6">
        {{ name }}
      </v-card-title>
      <v-main class="flex-grow-0">
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
