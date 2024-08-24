<script setup lang="ts">
import SignInGoogleForm from '~/components/features/Auth/SignInGoogleForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
  name: 'signInWithGoogle',
  title: 'signInWithGoogle',
  description: 'signInWithGoogle',
})
</script>

<template>
  <SignInGoogleForm />
</template>
