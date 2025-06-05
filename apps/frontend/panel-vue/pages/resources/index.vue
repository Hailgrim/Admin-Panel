<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'resources',
  title: 'resources',
  description: 'resources',
})

const router = useRouter()
const route = useRoute()
const reqPage = ref(Number(route.query.reqPage) || 1)
const reqLimit = ref(Number(route.query.reqLimit) || 25)
const { data, execute } = resourcesApi.getList({ reqPage, reqLimit, reqCount: true })

if (import.meta.server) {
  await execute()
}

watch(
  reqPage,
  () => {
    router.push({ query: { ...route.query, reqPage: reqPage.value } })
  },
)

watch(
  reqLimit,
  () => {
    router.push({ query: { ...route.query, reqLimit: reqLimit.value } })
  },
)
</script>

<template>
  <ResourcesList
    v-model:page="reqPage"
    v-model:limit="reqLimit"
    :count="data?.count"
    :rows="data?.rows"
  />
</template>
