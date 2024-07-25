<script setup lang="ts">
import usersApi from '~/api/users/usersApi'
import UsersTable from '~/components/entities/Tables/UsersTable.vue'

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
const { data: lcData, execute: lcExecute } = usersApi.listCounted()
const { data: lData, execute: lExecute } = usersApi.list()
await lcExecute({ page: page.value, quantity: quantity.value })
const count = ref(lcData.value?.count || 0)
const users = computed(() => lData.value || lcData.value?.rows || [])

watch(
  [page, quantity],
  () => {
    router.push({ query: { page: page.value, quantity: quantity.value } })
    lExecute({ page: page.value, quantity: quantity.value })
  },
)
</script>

<template>
  <UsersTable
:count="count" :page="page" :quantity="quantity" :users="users" @update:page="value => page = value"
    @update:quantity="value => quantity = value" />
</template>
