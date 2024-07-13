<script setup lang="ts">
import CreateResource from '~/components/entities/Forms/Resource/CreateResource.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'newResource',
  title: 'newResource',
  description: 'newResource',
})
</script>

<template>
  <CreateResource />
</template>
