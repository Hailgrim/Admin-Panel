<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormTextInput from '../FormTextInput.vue'
import FormButton from '../FormButton.vue'
import FormAuthLink from '../FormAuthLink.vue'
import { ROUTES } from '~/libs/config'
import { testString } from '~/libs/functions'
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from '~/libs/constants'

const { t } = useI18n()
const name = ref('')
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')
const email = ref('')
const emailIsValid = (value: string) => testString(EMAIL_REGEX, value) || t('emailValidation')
const password = ref('')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')

function submitHandler() {
  if (
    nameIsValid(name.value) === true
    && emailIsValid(email.value) === true
    && passwordIsValid(password.value) === true
  ) {
    // ...
  }
}
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormTextInput
      v-model:model-value="name" required name="name" type="text" :label="$t('name')"
      :rules="[nameIsValid]" :hint="$t('nameValidation')"
    />
    <FormTextInput
      v-model:model-value="email" required name="email" type="text" :label="$t('email')"
      :rules="[emailIsValid]" :hint="$t('emailValidation')"
    />
    <FormTextInput
      v-model:model-value="password" required name="password" type="text"
      :label="$t('password')" :rules="[passwordIsValid]" :hint="$t('passwordValidation')"
    />
    <FormButton block type="submit" color="success">
      {{ $t('signUp') }}
    </FormButton>
    <FormAuthLink :href="ROUTES.auth.signIn" :text="$t('signInText')" />
    <FormAuthLink :href="ROUTES.auth.forget" :text="$t('forgotPasswordText')" />
  </FormBox>
</template>
