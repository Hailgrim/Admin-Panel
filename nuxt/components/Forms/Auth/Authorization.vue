<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormError from '../FormError.vue'
import FormTextInput from '../FormTextInput.vue'
import FormPasswordInput from '../FormPasswordInput.vue'
import FormCheckbox from '../FormCheckbox.vue'
import FormButton from '../FormButton.vue'
import FormAuthLink from '../FormAuthLink.vue'
import { ROUTES } from '~/libs/config'
import { useProfileStore } from '~/stores/profile'

const email = ref('')
const emailIsValid = (value: string) => value.length > 0
const password = ref('')
const passwordIsValid = (value: string) => value.length > 0
const rememberMe = ref(false)
const profileStore = useProfileStore()

function submitHandler() {
  if (
    emailIsValid(email.value) === true
    && passwordIsValid(password.value) === true
  )
    profileStore.authorization()
}

const { data: todo } = await useFetch<any>('https://jsonplaceholder.typicode.com/todos/1')
</script>

<template>
  <div id="ebat">
    {{ todo.title }}
  </div>
  <FormBox @submit="submitHandler">
    <FormError :title="$t('error')" :text="$t('wrongEmailOrPassword')" />
    <FormTextInput
      v-model:model-value="email" required name="email" :label="$t('email')"
      :rules="[emailIsValid]"
    />
    <FormPasswordInput
      v-model:model-value="password" required name="password" :label="$t('password')"
      :rules="[passwordIsValid]"
    />
    <FormCheckbox v-model:model-value="rememberMe" name="rememberMe" :label="$t('rememberMe')" />
    <FormButton block type="submit" color="info">
      {{ $t('signIn') }}
    </FormButton>
    <FormAuthLink :href="ROUTES.auth.signUp" :text="$t('signUpText')" />
    <FormAuthLink :href="ROUTES.auth.forget" :text="$t('forgotPasswordText')" />
  </FormBox>
</template>
