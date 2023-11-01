<script setup lang="ts">
import RolesTable from '~/components/Tables/RolesTable.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'roles',
  title: 'roles',
  description: 'roles',
})
</script>

<template>
  <RolesTable />
</template>
