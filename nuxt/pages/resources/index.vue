<script setup lang="ts">
import resourcesApi from '~/api/resources/resourcesApi'
import ResourcesList from '~/components/features/Resources/ResourcesList.vue'

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
const { data, execute } = resourcesApi.listCounted(ROUTES.api.resources)
if (import.meta.server)
  await execute({ page: page.value, quantity: quantity.value })
const count = ref(data.value?.count)

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
  <ResourcesList v-model:page="page" v-model:quantity="quantity" :count="count" :rows="data?.rows" />
</template>
