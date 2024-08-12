<script setup lang="ts">
import SignUpForm from '~/components/features/Auth/SignUpForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
  name: 'signUp',
  title: 'signUp',
  description: 'signUp',
})
</script>

<template>
  <SignUpForm />
</template>
