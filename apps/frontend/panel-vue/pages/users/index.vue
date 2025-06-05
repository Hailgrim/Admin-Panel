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
const reqPage = ref(Number(route.query.reqPage))
const reqLimit = ref(Number(route.query.reqLimit))
const { data, execute } = usersApi.getList({ reqPage, reqLimit, reqCount: true })

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
  <UsersList
    v-model:page="reqPage"
    v-model:limit="reqLimit"
    :count="data?.count"
    :rows="data?.rows"
  />
</template>
