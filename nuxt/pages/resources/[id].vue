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
const { data: data, execute: execute } = resourcesApi.getOne(ROUTES.api.resource(id))
await execute(id)

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
