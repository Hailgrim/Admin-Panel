<script setup lang="ts">
import { useRolesStore } from '~/stores/roles'
import { useMainStore } from '~/stores/main'

const { t } = useI18n()
const headers = [
  { title: t('edit'), key: 'edit', width: 50, sortable: false },
  { title: t('id'), key: 'id', width: '10%' },
  { title: t('name'), key: 'name', width: '40%' },
  { title: t('description'), key: 'description', width: '50%' },
  { title: t('enabled'), key: 'enabled', width: 150 },
]
const selected = ref<number[]>([])
const route = useRoute()
const page = ref(Number(route.query.page) || 1)
const quantity = ref(Number(route.query.quantity) || 25)
const router = useRouter()
const rolesStore = useRolesStore()
await rolesStore.listCountedRefresh({ page: page.value, quantity: quantity.value })
const items = computed(() => {
  return (rolesStore.listData || rolesStore.listCountedData?.rows || [])
    .map(item => ({ ...item, selectable: !(item.default || item.admin) }))
})
const count = ref(rolesStore.listCountedData?.count || 0)
const mainStore = useMainStore()
const rolesRights = useRights(ROUTES.api.roles)

watch(
  [page, quantity],
  () => {
    router.push({ query: { page: page.value, quantity: quantity.value } })
    rolesStore.list({ page: page.value, quantity: quantity.value })
  },
)

watch(
  () => rolesStore.deletePending,
  () => {
    if (rolesStore.deleteError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(rolesStore.deleteError) })
    if (rolesStore.deleteData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      rolesStore.list({ page: page.value, quantity: quantity.value })
    }
  },
)
</script>

<template>
  <v-card-actions class="px-0">
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
  </v-card-actions>
  <v-data-table-server
    v-model="selected"
    v-model:page="page"
    v-model:items-per-page="quantity"
    :headers="headers"
    :items="items"
    :items-length="count"
    :items-per-page-options="[25, 50, 100]"
    :loading="rolesStore.listPending"
    item-selectable="selectable"
    class="full-page-table"
    show-select
    hover
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
