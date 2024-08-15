<script setup lang="ts">
import rolesApi from '~/api/roles/rolesApi'
import RolesList from '~/components/features/Roles/RolesList.vue'

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
const { data, execute } = rolesApi.listCounted(ROUTES.api.roles)
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
  <RolesList v-model:page="page" v-model:quantity="quantity" :count="count" :rows="data?.rows" />
</template>
