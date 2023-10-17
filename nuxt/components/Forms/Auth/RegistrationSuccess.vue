<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormAlert from '../FormAlert.vue'
import FormButton from '../FormButton.vue'

defineEmits(['close'])
</script>

<template>
  <FormBox @submit="$emit('close')">
    <FormAlert :title="$t('success')" :text="$t('registrationSuccessText')" type="success" />
    <FormButton block type="submit" color="info">
      {{ $t('signIn') }}
    </FormButton>
  </FormBox>
</template>
