<script setup lang="ts">
const { user } = defineProps<{ user: IUser, roles: IRole[] }>()

const updatedRoles = ref<IUsersRoles[]>(
  user.roles?.map(role => ({ roleId: role.id, userId: user.id })) || [],
)
const { t, locale } = useI18n()
const { status, error, execute } = usersApi.updateRoles({
  id: user.id,
  fields: { items: updatedRoles },
})
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users)

function submitHandler() {
  execute()
}

function setRoles(newRole: IUsersRoles) {
  let find = false

  const filtered = updatedRoles.value.filter((value) => {
    if (newRole.userId === value.userId && newRole.roleId === value.roleId) {
      find = true
      return false
    }
    else {
      return true
    }
  })

  if (!find) {
    filtered.push(newRole)
  }

  updatedRoles.value = filtered
}

watch(error, () => {
  if (!error.value) {
    return
  }

  mainStore.addAlert({
    type: 'error',
    text: getErrorText(error.value, locale.value),
  })
})

watch(status, () => {
  if (status.value === 'success') {
    mainStore.addAlert({ type: 'success', text: t('success') })
  }
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <div class="d-flex flex-row">
      <span
        v-for="role of roles"
        :key="`userRole.${role.id}`"
        class="mr-6"
      >
        <FormCheckbox
          :label="role.name"
          :model-value="updatedRoles.some((value) => value.roleId === role.id)"
          :name="`${role.name}.${role.id}`"
          @update:model-value="setRoles({ roleId: role.id, userId: user.id })"
        />
      </span>
    </div>
    <FormButton
      color="success"
      :disabled="!rights.updating"
      :loading="status === 'pending'"
      prepand-icon="mdi-content-save"
      type="submit"
    >
      {{ $t('update') }}
    </FormButton>
  </FormBase>
</template>
