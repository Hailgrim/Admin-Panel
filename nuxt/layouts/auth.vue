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
    <Meta
      :content="description"
      name="description"
    />
  </Head>
  <v-card>
    <v-layout class="content">
      <v-row class="flex-column align-stretch justify-center mx-auto v-col-xl-3 v-col-lg-4 v-col-sm-6 v-col-12">
        <v-card-title
          class="flex-grow-0 text-center pb-6 text-h5"
          tag="h1"
        >
          {{ name }}
        </v-card-title>
        <v-main class="flex-grow-0">
          <slot />
        </v-main>
      </v-row>
    </v-layout>
  </v-card>
</template>

<style scoped lang="scss">
.content {
  min-height: 100vh;
}
</style>
