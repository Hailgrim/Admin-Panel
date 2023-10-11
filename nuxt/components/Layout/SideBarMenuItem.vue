<script setup lang="ts">
import type { ISideBarMenuItem } from '~/libs/types'

const definedProps = defineProps<ISideBarMenuItem>()
const route = useRoute()
const router = useRouter()
const selected = ref(false)

watch(
  [() => route.path, () => definedProps.href],
  () => {
    let result = Boolean(definedProps.href)
    const pathArr = route.path.split('/')
    const linkArr = definedProps.href ? definedProps.href.split('/') : []
    linkArr.forEach((value, index) => {
      if (value !== pathArr[index])
        result = false
    })
    selected.value = result
  },
  { immediate: true },
)
</script>

<template>
  <v-list-group v-if="childs" :value="`${title}: ${href}`">
    <template #activator="{ props }">
      <v-list-item v-bind="props" :prepend-icon="icon" :title="title" />
    </template>
    <SideBarMenuItem v-for="child in childs" :key="child.title" v-bind="child" />
  </v-list-group>
  <v-list-item
    v-else :prepend-icon="icon" :title="title" link :href="href" :active="selected"
    @click.prevent="router.push(href || '#')"
  />
</template>
