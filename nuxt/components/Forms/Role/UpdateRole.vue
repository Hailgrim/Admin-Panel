<script setup lang="ts">
import Form from '~/components/Form/Form.vue'
import FormField from '~/components/Form/FormField.vue'
import FormCheckbox from '~/components/Form/FormCheckbox.vue'
import FormButton from '~/components/Form/FormButton.vue'
import { useRolesStore } from '~/stores/roles'
import { useMainStore } from '~/stores/main'
import type { IRole } from '~/utils/types'

const { role } = defineProps<{ role: IRole }>()

const { t, locale } = useI18n()
const rolesStore = useRolesStore()
const name = ref(role.name)
const nameIsValid = (value: string) => value.length > 0
const description = ref(role.description)
const enabled = ref(role.enabled)
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.roles)

function submitHandler() {
  if (nameIsValid(name.value)) {
    rolesStore.update({
      id: role.id,
      fields: { name: name.value, description: description.value, enabled: enabled.value },
    })
  }
}

watch(
  () => rolesStore.updatePending,
  () => {
    if (rolesStore.updatePending === true)
      return
    if (rolesStore.updateError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(rolesStore.updateError, locale.value) })
    if (rolesStore.updateData)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)

watch(
  () => rolesStore.deletePending,
  () => {
    if (rolesStore.deletePending === true)
      return
    if (rolesStore.deleteError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(rolesStore.deleteError, locale.value) })
    if (rolesStore.deleteData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.panel.roles)
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormField v-model:model-value="name" required name="name" :label="$t('name')" :rules="[nameIsValid]" />
    <FormField v-model:model-value="description" name="description" :label="$t('description')" />
    <FormCheckbox v-model:model-value="enabled" name="enabled" :label="$t('enabled')" />
    <FormButton
      type="submit" color="success" prepand-icon="mdi-content-save" :loading="rolesStore.updatePending"
      :disabled="!rights.updating || rolesStore.readData?.default || rolesStore.readData?.admin"
    >
      {{ $t('update') }}
    </FormButton>
    <FormButton
      type="button" color="error" prepand-icon="mdi-delete" :loading="rolesStore.deletePending"
      :disabled="!rights.deleting || rolesStore.readData?.default || rolesStore.readData?.admin"
      @click="rolesStore.delete(role.id)"
    >
      {{ $t('delete') }}
    </FormButton>
  </Form>
</template>
