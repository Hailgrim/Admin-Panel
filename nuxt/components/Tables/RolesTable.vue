<script setup lang="ts">
import { useRolesStore } from '~/stores/roles'
import { useMainStore } from '~/stores/main'
import type { IRole } from '~/utils/types'

const { roles, count, page, quantity } = defineProps<{
  roles: IRole[]
  count: number
  page: number
  quantity: number
}>()
defineEmits(['update:page', 'update:quantity'])

const { t } = useI18n()
const headers = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('name'), key: 'name', width: '40%' },
  { title: t('description'), key: 'description', width: '50%' },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const selected = ref<number[]>([])
const rolesStore = useRolesStore()
const items = computed(() => {
  return roles
    .map(value => ({ ...value, selectable: !(value.default || value.admin) }))
})
const mainStore = useMainStore()
const rolesRights = useRights(ROUTES.api.roles)

watch(
  () => rolesStore.deletePending,
  () => {
    if (rolesStore.deleteError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(rolesStore.deleteError) })
    if (rolesStore.deleteData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      rolesStore.listRefresh({ page, quantity })
    }
  },
)
</script>

<template>
  <div class="mb-3">
    <NuxtLink :href="rolesRights.creating ? ROUTES.panel.newRole : undefined">
      <v-btn
        class="me-2"
        variant="flat"
        color="info"
        prepend-icon="mdi-plus"
        :disabled="!rolesRights.creating"
      >
        {{ $t('create') }}
      </v-btn>
    </NuxtLink>
    <v-btn
      variant="flat"
      color="error"
      prepend-icon="mdi-delete"
      :disabled="!rolesRights.deleting || selected.length === 0"
      @click="rolesStore.delete(selected)"
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
    :loading="rolesStore.listPending"
    item-selectable="selectable"
    class="full-page-table"
    show-select
    hover
    @update:page="value => $emit('update:page', value)"
    @update:items-per-page="value => $emit('update:quantity', value)"
  >
    <template #item.edit="{ item }">
      <NuxtLink :href="item.admin ? undefined : ROUTES.panel.role(item.id)">
        <v-btn icon="mdi-pencil" size="small" variant="text" color="white" :disabled="item.admin" />
      </NuxtLink>
    </template>
    <template #item.enabled="{ item }">
      <v-icon :icon="item.enabled ? 'mdi-check' : 'mdi-close'" />
    </template>
  </v-data-table-server>
</template>
