<script setup lang="ts">
import type { IRole } from '~/api/roles/types'
import type { IUser } from '~/api/users/types'

defineProps<{
  count: number
  page?: number
  quantity?: number
}>()
defineEmits<{
  'update:page': [value: number]
  'update:quantity': [value: number]
  'update:selected': [value: string[]]
}>()
const rows = defineModel<IUser[]>('rows')
const loading = defineModel<boolean>('loading')

const { t } = useI18n()
const columns = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('email'), key: 'email', width: '30%' },
  { title: t('name'), key: 'name', width: '30%' },
  { title: t('roles'), key: 'roles', width: '30%' },
  { title: t('verified'), key: 'verified', width: 150 },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const items = computed(() => rows.value?.map(value => ({ ...value, selectable: !value.roles?.some(role => role.admin) })))
</script>

<template>
  <v-data-table-server
class="full-page-table" :headers="columns" hover item-selectable="selectable" :items="items"
    :items-length="count" :items-per-page="quantity" :items-per-page-options="[25, 50, 100]" :loading="loading"
    :page="page" show-select @update:items-per-page="$emit('update:quantity', $event)"
    @update:model-value="$emit('update:selected', $event as string[])" @update:page="$emit('update:page', $event)">
    <template #item.edit="{ item }">
      <NuxtLink :href="ROUTES.ui.user(item.id)">
        <v-btn color="white" icon="mdi-pencil" size="small" variant="text" />
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
