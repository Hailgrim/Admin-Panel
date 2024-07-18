<script setup lang="ts">
import CreateRoleForm from '~/components/entities/Forms/Role/CreateRoleForm.vue'

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
