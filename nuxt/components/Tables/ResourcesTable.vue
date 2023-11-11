<script setup lang="ts">
import { useResourcesStore } from '~/stores/resources'
import { useMainStore } from '~/stores/main'
import type { IResource } from '~/utils/types'

const { resources, count, page, quantity } = defineProps<{
  resources: IResource[]
  count: number
  page: number
  quantity: number
}>()
defineEmits(['update:page', 'update:quantity'])

const { t } = useI18n()
const headers = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('name'), key: 'name', width: '30%' },
  { title: t('path'), key: 'path', width: '20%' },
  { title: t('description'), key: 'description', width: '60%' },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const selected = ref<number[]>([])
const resourcesStore = useResourcesStore()
const items = computed(() => {
  return resources
    .map(value => ({ ...value, selectable: !value.default }))
})
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.resources)

watch(
  () => resourcesStore.deletePending,
  () => {
    if (resourcesStore.deleteError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(resourcesStore.deleteError) })
    if (resourcesStore.deleteData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      resourcesStore.list({ page, quantity })
    }
  },
)
</script>

<template>
  <div class="mb-3">
    <NuxtLink :href="rights.creating ? ROUTES.panel.newResource : undefined">
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
      @click="resourcesStore.delete(selected)"
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
    :loading="resourcesStore.listPending"
    item-selectable="selectable"
    class="full-page-table"
    show-select
    hover
    @update:page="value => $emit('update:page', value)"
    @update:items-per-page="value => $emit('update:quantity', value)"
  >
    <template #item.edit="{ item }">
      <NuxtLink :href="item.default ? undefined : ROUTES.panel.resource(item.id)">
        <v-btn icon="mdi-pencil" size="small" variant="text" color="white" :disabled="item.default" />
      </NuxtLink>
    </template>
    <template #item.enabled="{ item }">
      <v-icon :icon="item.enabled ? 'mdi-check' : 'mdi-close'" />
    </template>
  </v-data-table-server>
</template>
