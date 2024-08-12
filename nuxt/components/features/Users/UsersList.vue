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

const { t, locale } = useI18n()
const page = ref(props.page || 1)
const quantity = ref(props.quantity || 25)
const count = ref(props.count || page.value * quantity.value)
const { data: lData, execute: lExecute, pending: lPending } = usersApi.list()
const { data: dData, error: dError, execute: dExecute, pending: dPending } = usersApi.delete()
const items = computed(() => lData.value || props.rows || [])
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
    :loading="dPending || lPending" :rows="items" @update:page="$emit('update:page', $event)"
    @update:quantity="$emit('update:quantity', $event)" />
</template>
