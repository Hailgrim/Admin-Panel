<script setup lang="ts">
import type { IMenuItem } from '~/utils/types'

const props = defineProps<IMenuItem>()
const route = useRoute()
const router = useRouter()
const selected = ref(false)

watch(
  () => route.path,
  () => {
    let result = Boolean(props.href)
    const pathArr = route.path.split('/')
    const linkArr = props.href ? props.href.split('/') : []
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
  <v-list-group v-if="childs?.length" :value="`${title}: ${href}`" :fluid="true">
    <template #activator="{ props: itemProps }">
      <v-list-item v-bind="itemProps" :prepend-icon="icon" :title="title" />
    </template>
    <v-divider />
    <SideBarMenuItem v-for="child of childs" :key="`sbmi:${child.title}:${child.href}`" v-bind="child" />
  </v-list-group>
  <v-list-item
    v-else :prepend-icon="icon" :title="title" link :href="href" :active="selected"
    @click.prevent="router.push(href || '#')"
  />
</template>
