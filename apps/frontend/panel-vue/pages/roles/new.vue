<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'newRole',
  title: 'newRole',
  description: 'newRole',
})
</script>

<template>
  <CreateRoleForm />
</template>
