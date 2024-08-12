<script setup lang="ts">
import UpdateProfileForm from '~/components/features/Profile/UpdateProfileForm.vue'
import ProfileSessions from '~/components/features/Profile/ProfileSessions.vue'
import ProfileRoles from '~/components/features/Profile/ProfileRoles.vue'
import UpdatePasswordForm from '~/components/features/Profile/UpdatePasswordForm.vue'
import ChangeEmailRequestForm from '~/components/features/Profile/ChangeEmailRequestForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'profile',
  title: 'profile',
  description: 'profile',
})
</script>

<template>
  <UpdateProfileForm />
  <v-card-title class="px-0 py-3">
    {{ $t('roles') }}
  </v-card-title>
  <ProfileRoles />
  <v-card-title class="px-0 py-3">
    {{ $t('changeEmail') }}
  </v-card-title>
  <ChangeEmailRequestForm />
  <v-card-title class="px-0 py-3">
    {{ $t('updatePassword') }}
  </v-card-title>
  <UpdatePasswordForm />
  <v-card-title class="px-0 py-3">
    {{ $t('sessions') }}
  </v-card-title>
  <ProfileSessions />
</template>
