<script setup lang="ts">
import SignInForm from '~/components/features/Auth/SignInForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
  name: 'signIn',
  title: 'signIn',
  description: 'signIn',
})
</script>

<template>
  <SignInForm />
</template>
