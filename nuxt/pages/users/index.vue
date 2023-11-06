<script setup lang="ts">
import UsersTable from '~/components/Tables/UsersTable.vue'
import { useUsersStore } from '~/stores/users'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'users',
  title: 'users',
  description: 'users',
})

const router = useRouter()
const route = useRoute()
const page = ref(Number(route.query.page) || 1)
const quantity = ref(Number(route.query.quantity) || 25)
const usersStore = useUsersStore()
await usersStore.listCountedRefresh({ page: page.value, quantity: quantity.value })
const count = ref(usersStore.listCountedData?.count || 0)
const users = computed(() => usersStore.listData || usersStore.listCountedData?.rows || [])

watch(
  [page, quantity],
  () => {
    router.push({ query: { page: page.value, quantity: quantity.value } })
    usersStore.list({ page: page.value, quantity: quantity.value })
  },
)
</script>

<template>
  <UsersTable
    :users="users"
    :count="count"
    :page="page"
    :quantity="quantity"
    @update:page="value => page = value"
    @update:quantity="value => quantity = value"
  />
</template>
