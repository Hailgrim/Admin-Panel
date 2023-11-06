<script setup lang="ts">
import RolesTable from '~/components/Tables/RolesTable.vue'
import { useRolesStore } from '~/stores/roles'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'roles',
  title: 'roles',
  description: 'roles',
})

const router = useRouter()
const route = useRoute()
const page = ref(Number(route.query.page) || 1)
const quantity = ref(Number(route.query.quantity) || 25)
const rolesStore = useRolesStore()
await rolesStore.listCountedRefresh({ page: page.value, quantity: quantity.value })
const count = ref(rolesStore.listCountedData?.count || 0)
const roles = computed(() => rolesStore.listData || rolesStore.listCountedData?.rows || [])

watch(
  [page, quantity],
  () => {
    router.push({ query: { page: page.value, quantity: quantity.value } })
    rolesStore.list({ page: page.value, quantity: quantity.value })
  },
)
</script>

<template>
  <RolesTable
    :roles="roles"
    :count="count"
    :page="page"
    :quantity="quantity"
    @update:page="value => page = value"
    @update:quantity="value => quantity = value"
  />
</template>
