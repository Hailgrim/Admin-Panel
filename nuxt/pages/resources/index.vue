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
const page = ref(Number(route.query.page) || 1)
const quantity = ref(Number(route.query.quantity) || 25)
const { data, execute } = resourcesApi.getList(ROUTES.api.resources)
if (import.meta.server)
  await execute({ reqPage: page.value, reqLimit: quantity.value, reqCount: true })

watch(
  page,
  () => {
    router.push({ query: { ...route.query, page: page.value } })
  },
)

watch(
  quantity,
  () => {
    router.push({ query: { ...route.query, quantity: quantity.value } })
  },
)
</script>

<template>
  <ResourcesList
    v-model:page="page"
    v-model:quantity="quantity"
    :count="data?.count"
    :rows="data?.rows"
  />
</template>
