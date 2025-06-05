<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'resource',
  title: 'resource',
  description: 'resource',
})

const route = useRoute()
const id = String(route.params.id)
const { data, execute } = resourcesApi.getOne(id)
await execute()

if (data.value === null) {
  showError({
    statusCode: 404,
  })
}
</script>

<template>
  <UpdateResourceForm
    v-if="data"
    :resource="data"
  />
</template>
