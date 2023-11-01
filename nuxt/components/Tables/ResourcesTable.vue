<script setup lang="ts">
import { useResourcesStore } from '~/stores/resources'
import { useMainStore } from '~/stores/main'

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
const route = useRoute()
const page = ref(Number(route.query.page) || 1)
const quantity = ref(Number(route.query.quantity) || 25)
const router = useRouter()
const resourcesStore = useResourcesStore()
await resourcesStore.listCountedRefresh({ page: page.value, quantity: quantity.value })
const items = computed(() => {
  return (resourcesStore.listData || resourcesStore.listCountedData?.rows || [])
    .map(item => ({ ...item, selectable: !item.default }))
})
const count = ref(resourcesStore.listCountedData?.count || 0)
const mainStore = useMainStore()
const resourcesRights = useRights(ROUTES.api.resources)

watch(
  [page, quantity],
  () => {
    router.push({ query: { page: page.value, quantity: quantity.value } })
    resourcesStore.list({ page: page.value, quantity: quantity.value })
  },
)

watch(
  () => resourcesStore.deletePending,
  () => {
    if (resourcesStore.deleteError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(resourcesStore.deleteError) })
    if (resourcesStore.deleteData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      resourcesStore.list({ page: page.value, quantity: quantity.value })
    }
  },
)
</script>

<template>
  <v-card-actions class="px-0">
    <NuxtLink :href="resourcesRights.creating ? ROUTES.panel.newResource : undefined">
      <v-btn
        class="me-2"
        variant="flat"
        color="info"
        prepend-icon="mdi-plus"
        :disabled="!resourcesRights.creating"
      >
        {{ $t('create') }}
      </v-btn>
    </NuxtLink>
    <v-btn
      variant="flat"
      color="error"
      prepend-icon="mdi-delete"
      :disabled="!resourcesRights.deleting || selected.length === 0"
      @click="resourcesStore.delete(selected)"
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
    :loading="resourcesStore.listPending"
    item-selectable="selectable"
    class="full-page-table"
    show-select
    hover
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
