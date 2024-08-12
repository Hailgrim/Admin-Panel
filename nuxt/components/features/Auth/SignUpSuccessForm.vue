<script setup lang="ts">
import Form from '~/components/shared/ui/Form/Form.vue'
import FormAlert from '~/components/shared/ui/Form/FormAlert.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'

defineEmits<{
  close: []
}>()
</script>

<template>
  <Form @submit="$emit('close')">
    <FormAlert :text="$t('registrationSuccessText')" type="success" />
    <FormButton block color="info" type="submit">
      {{ $t('signIn') }}
    </FormButton>
  </Form>
</template>
