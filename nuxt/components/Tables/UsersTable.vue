<script setup lang="ts">
import { useUsersStore } from '~/stores/users'
import { useMainStore } from '~/stores/main'
import type { IRole, IUser } from '~/utils/types'

const { users, count, page, quantity } = defineProps<{
  users: IUser[]
  count: number
  page: number
  quantity: number
}>()
defineEmits(['update:page', 'update:quantity'])

const { t, locale } = useI18n()
const headers = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('email'), key: 'email', width: '30%' },
  { title: t('name'), key: 'name', width: '30%' },
  { title: t('roles'), key: 'roles', width: '30%' },
  { title: t('verified'), key: 'verified', width: 150 },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const selected = ref<number[]>([])
const usersStore = useUsersStore()
const items = computed(() => {
  return users
    .map(value => ({ ...value, selectable: !value.roles?.some(role => role.admin) }))
})
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users)

watch(
  () => usersStore.deletePending,
  () => {
    if (usersStore.deleteError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(usersStore.deleteError, locale.value) })
    if (usersStore.deleteData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      usersStore.listRefresh({ page, quantity })
    }
  },
)
</script>

<template>
  <div class="mb-3">
    <NuxtLink :href="rights.creating ? ROUTES.panel.newUser : undefined">
      <v-btn
        class="me-2"
        variant="flat"
        color="info"
        prepend-icon="mdi-plus"
        :disabled="!rights.creating"
      >
        {{ $t('create') }}
      </v-btn>
    </NuxtLink>
    <v-btn
      variant="flat"
      color="error"
      prepend-icon="mdi-delete"
      :disabled="!rights.deleting || selected.length === 0"
      @click="usersStore.delete(selected)"
    >
      {{ $t('delete') }}
    </v-btn>
  </div>
  <v-data-table-server
    v-model="selected"
    :headers="headers"
    :items="items"
    :items-length="count"
    :page="page"
    :items-per-page="quantity"
    :items-per-page-options="[25, 50, 100]"
    :loading="usersStore.listPending"
    item-selectable="selectable"
    class="full-page-table"
    show-select
    hover
    @update:page="value => $emit('update:page', value)"
    @update:items-per-page="value => $emit('update:quantity', value)"
  >
    <template #item.edit="{ item }">
      <NuxtLink :href="ROUTES.panel.user(item.id)">
        <v-btn icon="mdi-pencil" size="small" variant="text" color="white" />
      </NuxtLink>
    </template>
    <template #item.roles="{ item }">
      {{ item.roles?.map((role: IRole) => role.name).join(', ') }}
    </template>
    <template #item.verified="{ item }">
      <v-icon :icon="item.verified ? 'mdi-check' : 'mdi-close'" />
    </template>
    <template #item.enabled="{ item }">
      <v-icon :icon="item.enabled ? 'mdi-check' : 'mdi-close'" />
    </template>
  </v-data-table-server>
</template>
