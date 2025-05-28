<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'roles',
  title: 'roles',
  description: 'roles',
})

const router = useRouter()
const route = useRoute()
const reqPage = ref(Number(route.query.reqPage) || 1)
const reqLimit = ref(Number(route.query.reqLimit) || 25)
const { data, execute } = rolesApi.getList({ reqPage, reqLimit, reqCount: true })

if (import.meta.server) {
  await execute()
}

watch(
  reqPage,
  () => {
    router.push({ query: { ...route.query, reqPage: reqPage.value } })
  },
)

watch(
  reqLimit,
  () => {
    router.push({ query: { ...route.query, reqLimit: reqLimit.value } })
  },
)
</script>

<template>
  <RolesList
    v-model:page="reqPage"
    v-model:limit="reqLimit"
    :count="data?.count"
    :rows="data?.rows"
  />
</template>
