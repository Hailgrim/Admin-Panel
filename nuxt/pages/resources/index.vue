<script setup lang="ts">
import ResourcesTable from '~/components/Tables/ResourcesTable.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'resources',
  title: 'resources',
  description: 'resources',
})
</script>

<template>
  <ResourcesTable />
</template>
