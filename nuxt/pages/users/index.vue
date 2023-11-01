<script setup lang="ts">
import UsersTable from '~/components/Tables/UsersTable.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'users',
  title: 'users',
  description: 'users',
})
</script>

<template>
  <UsersTable />
</template>
