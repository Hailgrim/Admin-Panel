<script setup lang="ts">
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
const { data, execute } = usersApi.getList({ reqPage: page, reqLimit: quantity, reqCount: true })

if (import.meta.server) {
  await execute()
}

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
  <UsersList
    v-model:page="page"
    v-model:quantity="quantity"
    :count="data?.count"
    :rows="data?.rows"
  />
</template>
