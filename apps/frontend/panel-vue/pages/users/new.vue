<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'newUser',
  title: 'newUser',
  description: 'newUser',
})
</script>

<template>
  <CreateUserForm />
</template>
