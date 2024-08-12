<script setup lang="ts">
import type { IRole } from '~/api/roles/types'
import rolesApi from '~/api/roles/rolesApi'
import RolesTable from '~/components/entities/Role/RolesTable.vue'
import { useMainStore } from '~/store/main/main'

const props = defineProps<{
  rows?: IRole[]
  count?: number
  page?: number
  quantity?: number
}>()
defineEmits<{
  'update:page': [value: number]
  'update:quantity': [value: number]
}>()

const { t, locale } = useI18n()
const page = ref(props.page || 1)
const quantity = ref(props.quantity || 25)
const count = ref(props.count || page.value * quantity.value)
const { data: lData, execute: lExecute, pending: lPending } = rolesApi.list()
const { data: dData, error: dError, execute: dExecute, pending: dPending } = rolesApi.delete()
const items = computed(() => lData.value || props.rows || [])
const rights = useRights(ROUTES.api.roles)
const mainStore = useMainStore()
const selected = ref<number[]>([])

watch(
  [page, quantity],
  () => {
    lExecute({ page: page.value, quantity: quantity.value })
  },
)

watch(
  dError,
  () => {
    if (dError.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(dError.value, locale.value) })
  },
)

watch(
  dData,
  () => {
    if (dData.value) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      lExecute({ page: page.value, quantity: quantity.value })
    }
  },
)
</script>

<template>
  <div class="mb-3">
    <NuxtLink :href="rights.creating ? ROUTES.ui.newRole : undefined">
      <v-btn class="me-2" color="info" :disabled="!rights.creating" prepend-icon="mdi-plus" variant="flat">
        {{ $t('create') }}
      </v-btn>
    </NuxtLink>
    <v-btn
color="error" :disabled="!rights.deleting || selected.length === 0" :loading="dPending"
      prepend-icon="mdi-delete" variant="flat" @click="dExecute(selected)">
      {{ $t('delete') }}
    </v-btn>
  </div>
  <RolesTable
v-model:page="page" v-model:quantity="quantity" v-model:selected="selected" :count="count"
    :loading="dPending || lPending" :rows="items" @update:page="$emit('update:page', $event)"
    @update:quantity="$emit('update:quantity', $event)" />
</template>
