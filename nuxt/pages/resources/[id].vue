<script setup lang="ts">
import UpdateResourceForm from '~/components/entities/Forms/Resource/UpdateResourceForm.vue'
import { useResourcesStore } from '~/stores/resources/resources'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'resource',
  title: 'resource',
  description: 'resource',
})

const route = useRoute()
const id = route.params.id
const resourcesStore = useResourcesStore()
await resourcesStore.readRefresh(id)
if (resourcesStore.readData === null) {
  showError({
    statusCode: 404,
  })
}
</script>

<template>
  <UpdateResourceForm v-if="resourcesStore.readData" :resource="resourcesStore.readData" />
</template>
