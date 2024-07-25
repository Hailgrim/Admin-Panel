<script setup lang="ts">
import rolesApi from '~/api/roles/rolesApi'
import type { IRole } from '~/api/roles/types'
import { useMainStore } from '~/store/main/main'

const { roles, count, page, quantity } = defineProps<{
  roles: IRole[]
  count: number
  page: number
  quantity: number
}>()
defineEmits(['update:page', 'update:quantity'])

const { t, locale } = useI18n()
const headers = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('name'), key: 'name', width: '40%' },
  { title: t('description'), key: 'description', width: '50%' },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const selected = ref<number[]>([])
const { data: lData, execute: lExecute, pending: lPending } = rolesApi.list()
const { data: dData, error: dError, execute: dExecute, pending: dPending } = rolesApi.delete()
const items = computed(() => {
  return (lData.value || roles)
    .map(value => ({ ...value, selectable: !(value.default || value.admin) }))
})
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.roles)

watch(
  dPending,
  () => {
    if (dPending.value) return

    if (dError.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(dError.value, locale.value) })

    if (dData.value) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      lExecute({ page, quantity })
    }
  },
)
</script>

<template>
  <div class="mb-3">
    <NuxtLink :href="rights.creating ? ROUTES.panel.newRole : undefined">
      <v-btn class="me-2" color="info" :disabled="!rights.creating" prepend-icon="mdi-plus" variant="flat">
        {{ $t('create') }}
      </v-btn>
    </NuxtLink>
    <v-btn
color="error" :disabled="!rights.deleting || selected.length === 0" prepend-icon="mdi-delete" variant="flat"
      @click="dExecute(selected)">
      {{ $t('delete') }}
    </v-btn>
  </div>
  <v-data-table-server
v-model="selected" class="full-page-table" :headers="headers" hover item-selectable="selectable"
    :items="items" :items-length="count" :items-per-page="quantity" :items-per-page-options="[25, 50, 100]"
    :loading="lPending" :page="page" show-select @update:items-per-page="value => $emit('update:quantity', value)"
    @update:page="value => $emit('update:page', value)">
    <template #item.edit="{ item }">
      <NuxtLink :href="item.admin ? undefined : ROUTES.panel.role(item.id)">
        <v-btn color="white" :disabled="item.admin" icon="mdi-pencil" size="small" variant="text" />
      </NuxtLink>
    </template>
    <template #item.enabled="{ item }">
      <v-icon :icon="item.enabled ? 'mdi-check' : 'mdi-close'" />
    </template>
  </v-data-table-server>
</template>
