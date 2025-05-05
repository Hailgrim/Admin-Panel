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
const { data, execute } = rolesApi.findAll(ROUTES.api.roles)
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
  <RolesList v-model:page="page" v-model:quantity="quantity" :count="data?.count" :rows="data?.rows" />
</template>
