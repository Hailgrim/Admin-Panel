<script setup lang="ts">
import Form from '~/components/shared/kit/Form/Form.vue'
import FormCheckbox from '~/components/shared/kit/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import { useMainStore } from '~/store/main/main'
import usersApi from '~/api/users/usersApi'
import type { IUser } from '~/api/users/types'
import type { IRole, IUsersRoles } from '~/api/roles/types'

const { user, roles } = defineProps<{ user: IUser, roles: IRole[] }>()

const updatedRoles = ref(user.roles?.map(role => role.UsersRoles) || [])
const { t, locale } = useI18n()
const { data, error, execute, pending } = usersApi.updateRoles()
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users)

function submitHandler() {
  execute({
    id: user.id,
    fields: updatedRoles.value,
  })
}

function setRoles(newRole: IUsersRoles) {
  let find = false

  const filtered = updatedRoles.value.filter((value) => {
    if (
      newRole.userId === value?.userId
      && newRole.roleId === value?.roleId
    ) {
      find = true
      return false
    }
    else {
      return true
    }
  })

  if (!find)
    filtered.push(newRole)

  updatedRoles.value = filtered
}

watch(
  pending,
  () => {
    if (pending.value) return

    if (error.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(error.value, locale.value) })

    if (data.value)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <div class="d-flex flex-row">
      <span v-for="role of roles" :key="`userRole.${role.id}`" class="mr-6">
        <FormCheckbox
:label="role.name"
          :model-value="updatedRoles.some(value => value?.roleId === role.id)" :name="`${role.name}.${role.id}`"
          @update:model-value="setRoles({ roleId: role.id, userId: user.id })" />
      </span>
    </div>
    <FormButton
color="success" :disabled="!rights.updating" :loading="pending" prepand-icon="mdi-content-save"
      type="submit">
      {{ $t('update') }}
    </FormButton>
  </Form>
</template>
