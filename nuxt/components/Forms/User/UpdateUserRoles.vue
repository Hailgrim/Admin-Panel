<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormCheckbox from '../FormCheckbox.vue'
import FormButton from '../FormButton.vue'
import { useMainStore } from '~/stores/main'
import { useUsersStore } from '~/stores/users'
import type { IRole, IUser, IUsersRoles } from '~/utils/types'

const { user, roles } = defineProps<{ user: IUser, roles: IRole[] }>()

const updatedRoles = ref(user.roles?.map(role => role.UsersRoles) || [])
const { t, locale } = useI18n()
const usersStore = useUsersStore()
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users)

function submitHandler() {
  usersStore.updateRoles({
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
  () => usersStore.updateRolesPending,
  () => {
    if (usersStore.updateRolesPending === true)
      return
    if (usersStore.updateRolesError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(usersStore.updateRolesError, locale.value) })
    if (usersStore.updateRolesData)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <div class="d-flex flex-row">
      <span v-for="role of roles" :key="`userRole.${role.id}`" class="mr-6">
        <FormCheckbox
          :model-value="updatedRoles.some(value => value?.roleId === role.id)"
          :name="`${role.name}.${role.id}`"
          :label="role.name"
          @update:model-value="setRoles({ roleId: role.id, userId: user.id })"
        />
      </span>
    </div>
    <FormButton
      type="submit" color="success" prepand-icon="mdi-content-save"
      :loading="usersStore.updateRolesPending" :disabled="!rights.updating"
    >
      {{ $t('update') }}
    </FormButton>
  </FormBox>
</template>
