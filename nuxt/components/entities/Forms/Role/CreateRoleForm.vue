<script setup lang="ts">
import Form from '~/components/shared/kit/Form/Form.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormCheckbox from '~/components/shared/kit/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import { useRolesStore } from '~/stores/roles/roles'
import { useMainStore } from '~/stores/main/main'

const { t, locale } = useI18n()
const name = ref('')
const nameIsValid = (value: string) => value.length > 0
const description = ref('')
const enabled = ref(true)
const rolesStore = useRolesStore()
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.roles)

function submitHandler() {
  if (nameIsValid(name.value))
    rolesStore.create({ name: name.value, description: description.value || null, enabled: enabled.value })
}

watch(
  () => rolesStore.createPending,
  () => {
    if (rolesStore.createPending === true)
      return
    if (rolesStore.createError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(rolesStore.createError, locale.value) })
    if (rolesStore.createData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.panel.role(rolesStore.createData.id))
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormField v-model:model-value="name" required name="name" :label="$t('name')" :rules="[nameIsValid]" />
    <FormField v-model:model-value="description" name="description" :label="$t('description')" />
    <FormCheckbox v-model:model-value="enabled" name="enabled" :label="$t('enabled')" />
    <FormButton type="submit" color="info" prepand-icon="mdi-plus" :loading="rolesStore.createPending"
      :disabled="!rights.creating">
      {{ $t('create') }}
    </FormButton>
  </Form>
</template>
