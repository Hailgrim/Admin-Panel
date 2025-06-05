<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'newResource',
  title: 'newResource',
  description: 'newResource',
})
</script>

<template>
  <CreateResourceForm />
</template>
