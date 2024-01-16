<script setup lang="ts">
import UpdateResource from '~/components/Forms/Resource/UpdateResource.vue'
import { useResourcesStore } from '~/stores/resources'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'resource',
  title: 'resource',
  description: 'resource',
})

const route = useRoute()
const id = Number(route.params.id)
const resourcesStore = useResourcesStore()
await resourcesStore.readRefresh(id)
if (resourcesStore.readData === null) {
  showError({
    statusCode: 404,
  })
}
</script>

<template>
  <UpdateResource v-if="resourcesStore.readData" :resource="resourcesStore.readData" />
</template>
