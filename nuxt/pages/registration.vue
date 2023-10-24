<script setup lang="ts">
import Registration from '~/components/Forms/Auth/Registration.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'authorization',
  name: 'signUp',
  title: 'signUp',
  description: 'signUp',
})
</script>

<template>
  <Registration />
</template>
