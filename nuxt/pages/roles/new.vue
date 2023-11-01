<script setup lang="ts">
import CreateRole from '~/components/Forms/Role/CreateRole.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'newRole',
  title: 'newRole',
  description: 'newRole',
})
</script>

<template>
  <CreateRole />
</template>
