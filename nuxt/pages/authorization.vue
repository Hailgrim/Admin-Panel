<script setup lang="ts">
import Authorization from '~/components/Forms/Auth/Authorization.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'authorization',
  name: 'signIn',
  title: 'signIn',
  description: 'signIn',
})
</script>

<template>
  <Authorization />
</template>
