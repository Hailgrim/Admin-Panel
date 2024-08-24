<script setup lang="ts">
import type { IUser } from '~/api/users/types'
import usersApi from '~/api/users/usersApi'
import UsersTable from '~/components/entities/User/UsersTable.vue'
import { useMainStore } from '~/store/main/main'

const props = defineProps<{
  rows?: IUser[]
  count?: number
  page?: number
  quantity?: number
}>()
defineEmits<{
  'update:page': [value: number]
  'update:quantity': [value: number]
}>()

const { locale } = useI18n()
const { data: lData, error: lError, execute: lExecute, pending: lPending } = usersApi.list()
const { data: lcData, error: lcError, execute: lcExecute, pending: lcPending } = usersApi.listCounted()
const { data: dData, error: dError, execute: dExecute, pending: dPending } = usersApi.delete()
const page = ref(props.page || 1)
const quantity = ref(props.quantity || 25)
const count = computed(() => lcData.value?.count || props.count || page.value * quantity.value)
const items = ref(props.rows)
const rights = useRights(ROUTES.api.users)
const mainStore = useMainStore()
const selected = ref<string[]>([])

watch(
  [page, quantity],
  () => {
    lExecute({ page: page.value, quantity: quantity.value })
  },
)

watch(
  () => props.rows,
  () => {
    if (!props.rows) {
      lcExecute({ page: page.value, quantity: quantity.value })
    }
  },
  { immediate: true },
)

watch(
  dData,
  () => {
    if (dData.value) {
      lcExecute({ page: page.value, quantity: quantity.value })
    }
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
  lData,
  () => {
    if (lData.value)
      items.value = lData.value
  },
)

watch(
  lError,
  () => {
    if (lError.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(lError.value, locale.value) })
  },
)

watch(
  lcData,
  () => {
    if (lcData.value)
      items.value = lcData.value.rows
  },
)

watch(
  lcError,
  () => {
    if (lcError.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(lcError.value, locale.value) })
  },
)
</script>

<template>
  <div class="mb-3">
    <NuxtLink :href="rights.creating ? ROUTES.ui.newUser : undefined">
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
  <UsersTable
v-model:page="page" v-model:quantity="quantity" v-model:selected="selected" :count="count"
    :loading="dPending || lPending || lcPending" :rows="items" @update:page="$emit('update:page', $event)"
    @update:quantity="$emit('update:quantity', $event)" />
</template>
