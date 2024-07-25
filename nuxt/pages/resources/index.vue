<script setup lang="ts">
import resourcesApi from '~/api/resources/resourcesApi'
import ResourcesTable from '~/components/entities/Tables/ResourcesTable.vue'

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
const { data: lcData, execute: lcExecute } = resourcesApi.listCounted()
const { data: lData, execute: lExecute } = resourcesApi.list()
await lcExecute({ page: page.value, quantity: quantity.value })
const count = ref(lcData.value?.count || 0)
const resources = computed(() => lData.value || lcData.value?.rows || [])

watch(
  [page, quantity],
  () => {
    router.push({ query: { page: page.value, quantity: quantity.value } })
    lExecute({ page: page.value, quantity: quantity.value })
  },
)
</script>

<template>
  <ResourcesTable
:count="count" :page="page" :quantity="quantity" :resources="resources"
    @update:page="value => page = value" @update:quantity="value => quantity = value" />
</template>
