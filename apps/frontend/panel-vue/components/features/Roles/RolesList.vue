<script setup lang="ts">
const props = defineProps<{
  rows?: IRole[]
  page?: number
  limit?: number
  count?: number
}>()
defineEmits<{
  'update:page': [value: number]
  'update:limit': [value: number]
}>()

const { locale } = useI18n()
const rights = useRights(ROUTES.api.roles)
const mainStore = useMainStore()
const items = ref(props.rows)
const page = ref(props.page || 1)
const limit = ref(props.limit || 25)
const reqCount = ref(false)
const selected = ref<string[]>([])
const {
  data: glData,
  error: glError,
  execute: glExecute,
  status: glStatus,
} = rolesApi.getList({ reqPage: page, reqLimit: limit, reqCount })
const {
  error: dError,
  execute: dExecute,
  status: dStatus,
} = rolesApi.delete({ items: selected })
const count = computed(
  () => glData.value?.count || props.count || page.value * limit.value,
)

watch(
  () => props.rows,
  () => {
    if (!props.rows) {
      reqCount.value = true
      glExecute()
      reqCount.value = false
    }
  },
  { immediate: true },
)

watch([page, limit], () => {
  glExecute()
})

watch(glData, () => {
  if (glData.value) {
    items.value = glData.value.rows
  }
})

watch(glError, () => {
  if (!glError.value) {
    return
  }

  mainStore.addAlert({
    type: 'error',
    text: getErrorText(glError.value, locale.value),
  })
})

watch(dStatus, () => {
  if (dStatus.value === 'success') {
    reqCount.value = true
    glExecute()
    reqCount.value = false
  }
})

watch(dError, () => {
  if (!dError.value) {
    return
  }

  mainStore.addAlert({
    type: 'error',
    text: getErrorText(dError.value, locale.value),
  })
})
</script>

<template>
  <div class="mb-3">
    <NuxtLink :href="rights.creating ? ROUTES.ui.newRole : undefined">
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
      @click="dExecute()"
    >
      {{ $t('delete') }}
    </v-btn>
  </div>
  <RolesTable
    v-model:page="page"
    v-model:quantity="limit"
    v-model:selected="selected"
    :count="count"
    :loading="dStatus === 'pending' || glStatus === 'pending'"
    :rows="items"
    @update:page="$emit('update:page', $event)"
    @update:quantity="$emit('update:limit', $event)"
  />
</template>
