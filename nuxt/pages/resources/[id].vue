<script setup lang="ts">
import resourcesApi from '~/api/resources/resourcesApi'
import UpdateResourceForm from '~/components/entities/Forms/Resource/UpdateResourceForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'resource',
  title: 'resource',
  description: 'resource',
})

const route = useRoute()
const id = Number(route.params.id)
const { data: data, execute: execute } = resourcesApi.read()
await execute(id)

if (data.value === null) {
  showError({
    statusCode: 404,
  })
}
</script>

<template>
  <UpdateResourceForm v-if="data" :resource="data" />
</template>
