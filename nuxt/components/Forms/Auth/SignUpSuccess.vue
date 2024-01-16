<script setup lang="ts">
import Form from '~/components/Form/Form.vue'
import FormAlert from '~/components/Form/FormAlert.vue'
import FormButton from '~/components/Form/FormButton.vue'

defineEmits(['close'])
</script>

<template>
  <Form @submit="$emit('close')">
    <FormAlert :text="$t('registrationSuccessText')" type="success" />
    <FormButton block type="submit" color="info">
      {{ $t('signIn') }}
    </FormButton>
  </Form>
</template>
