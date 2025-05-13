<script setup lang="ts">
defineProps<{
  count: number
  page?: number
  quantity?: number
}>()
defineEmits<{
  'update:page': [value: number]
  'update:quantity': [value: number]
  'update:selected': [value: number[]]
}>()
const rows = defineModel<IRole[]>('rows')
const loading = defineModel<boolean>('loading')

const { t } = useI18n()
const columns = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('name'), key: 'name', width: '40%' },
  { title: t('description'), key: 'description', width: '50%' },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const items = computed(() => rows.value?.map(value => ({ ...value, selectable: !value.default })))
</script>

<template>
  <v-data-table-server
    class="full-page-table"
    :headers="columns"
    hover
    item-selectable="selectable"
    :items="items"
    :items-length="count"
    :items-per-page="quantity"
    :items-per-page-options="[25, 50, 100]"
    :loading="loading"
    :page="page"
    show-select
    @update:items-per-page="$emit('update:quantity', $event)"
    @update:model-value="$emit('update:selected', $event as number[])"
    @update:page="$emit('update:page', $event)"
  >
    <template #item.edit="{ item }">
      <NuxtLink :href="item.default ? undefined : ROUTES.ui.role(item.id)">
        <v-btn
          color="white"
          :disabled="item.default"
          icon="mdi-pencil"
          size="small"
          variant="text"
        />
      </NuxtLink>
    </template>
    <template #item.enabled="{ item }">
      <v-icon :icon="item.enabled ? 'mdi-check' : 'mdi-close'" />
    </template>
  </v-data-table-server>
</template>
