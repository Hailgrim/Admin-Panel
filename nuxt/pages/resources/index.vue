<script setup lang="ts">
import ResourcesTable from '~/components/Tables/ResourcesTable.vue'
import { useResourcesStore } from '~/stores/resources'

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
const resourcesStore = useResourcesStore()
await resourcesStore.listCountedRefresh({ page: page.value, quantity: quantity.value })
const count = ref(resourcesStore.listCountedData?.count || 0)
const resources = computed(() => resourcesStore.listData || resourcesStore.listCountedData?.rows || [])

watch(
  [page, quantity],
  () => {
    router.push({ query: { page: page.value, quantity: quantity.value } })
    resourcesStore.list({ page: page.value, quantity: quantity.value })
  },
)
</script>

<template>
  <ResourcesTable
    :resources="resources"
    :count="count"
    :page="page"
    :quantity="quantity"
    @update:page="value => page = value"
    @update:quantity="value => quantity = value"
  />
</template>
