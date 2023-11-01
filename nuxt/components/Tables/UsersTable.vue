<script setup lang="ts">
import { useUsersStore } from '~/stores/users'
import { useMainStore } from '~/stores/main'
import { useRights } from '~/composables/useRights'
import type { IRole } from '~/utils/types';

const { t } = useI18n()
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
const route = useRoute()
const page = ref(Number(route.query.page) || 1)
const quantity = ref(Number(route.query.quantity) || 25)
const router = useRouter()
const usersStore = useUsersStore()
await usersStore.listCountedRefresh({ page: page.value, quantity: quantity.value })
const items = computed(() => {
  return (usersStore.listData || usersStore.listCountedData?.rows || [])
    .map(item => ({ ...item, selectable: !item.roles?.some(role => role.admin) }))
})
const count = ref(usersStore.listCountedData?.count || 0)
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users)

watch(
  [page, quantity],
  () => {
    router.push({ query: { page: page.value, quantity: quantity.value } })
    usersStore.list({ page: page.value, quantity: quantity.value })
  },
)

watch(
  () => usersStore.deletePending,
  () => {
    if (usersStore.deleteError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(usersStore.deleteError) })
    if (usersStore.deleteData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      usersStore.list({ page: page.value, quantity: quantity.value })
    }
  },
)
</script>

<template>
  <v-card-actions class="px-0">
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
  </v-card-actions>
  <v-data-table-server
    v-model="selected"
    v-model:page="page"
    v-model:items-per-page="quantity"
    :headers="headers"
    :items="items"
    :items-length="count"
    :items-per-page-options="[25, 50, 100]"
    :loading="usersStore.listPending"
    item-selectable="selectable"
    class="full-page-table"
    show-select
    hover
  >
    <template #item.edit="{ item }">
      <NuxtLink :href="ROUTES.panel.user(item.id)">
        <v-btn icon="mdi-pencil" size="small" variant="text" color="white" />
      </NuxtLink>
    </template>
    <template #item.roles="{ item }">
      {{ item.roles.map((role: IRole) => role.name).join(', ') }}
    </template>
    <template #item.verified="{ item }">
      <v-icon :icon="item.verified ? 'mdi-check' : 'mdi-close'" />
    </template>
    <template #item.enabled="{ item }">
      <v-icon :icon="item.enabled ? 'mdi-check' : 'mdi-close'" />
    </template>
  </v-data-table-server>
</template>
