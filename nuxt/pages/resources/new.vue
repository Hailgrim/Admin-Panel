<script setup lang="ts">
import CreateResourceForm from '~/components/entities/Forms/Resource/CreateResourceForm.vue'

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
