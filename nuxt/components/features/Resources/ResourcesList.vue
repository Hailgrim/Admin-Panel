<script setup lang="ts">
const props = defineProps<{
  rows?: IResource[]
  count?: number
  page?: number
  quantity?: number
}>()
defineEmits<{
  'update:page': [value: number]
  'update:quantity': [value: number]
}>()

const { locale } = useI18n()
const {
  data: faData,
  error: faError,
  execute: faExecute,
  status: faStatus,
} = resourcesApi.getList()
const {
  error: dError,
  execute: dExecute,
  status: dStatus,
} = resourcesApi.delete()
const page = ref(props.page || 1)
const quantity = ref(props.quantity || 25)
const count = computed(
  () => faData.value?.count || props.count || page.value * quantity.value,
)
const items = ref(props.rows)
const rights = useRights(ROUTES.api.resources)
const mainStore = useMainStore()
const selected = ref<string[]>([])

watch(
  () => props.rows,
  () => {
    if (!props.rows) {
      faExecute({
        reqPage: page.value,
        reqLimit: quantity.value,
        reqCount: true,
      })
    }
  },
  { immediate: true },
)

watch([page, quantity], () => {
  faExecute({ reqPage: page.value, reqLimit: quantity.value })
})

watch(faData, () => {
  if (faData.value) items.value = faData.value.rows
})

watch(faError, () => {
  if (faError.value)
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(faError.value, locale.value),
    })
})

watch(dStatus, () => {
  if (dStatus.value === 'success') {
    faExecute({
      reqPage: page.value,
      reqLimit: quantity.value,
      reqCount: true,
    })
  }
})

watch(dError, () => {
  if (dError.value)
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(dError.value, locale.value),
    })
})
</script>

<template>
  <div class="mb-3">
    <NuxtLink :href="rights.creating ? ROUTES.ui.newResource : undefined">
      <v-btn
        class="me-2"
        color="info"
        :disabled="!rights.creating"
        prepend-icon="mdi-plus"
        variant="flat"
      >
        {{ $t('create') }}
      </v-btn>
    </NuxtLink>
    <v-btn
      color="error"
      :disabled="!rights.deleting || selected.length === 0"
      :loading="dStatus === 'pending'"
      prepend-icon="mdi-delete"
      variant="flat"
      @click="dExecute({ items: selected })"
    >
      {{ $t('delete') }}
    </v-btn>
  </div>
  <ResourcesTable
    v-model:page="page"
    v-model:quantity="quantity"
    v-model:selected="selected"
    :count="count"
    :loading="dStatus === 'pending' || faStatus === 'pending'"
    :rows="items"
    @update:page="$emit('update:page', $event)"
    @update:quantity="$emit('update:quantity', $event)"
  />
</template>
