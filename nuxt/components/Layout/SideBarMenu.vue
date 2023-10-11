<script setup lang="ts">
import SideBarMenuItem from './SideBarMenuItem.vue'
import type { ISideBarMenuItem } from '~/libs/types'
import { checkActiveLink } from '~/libs/functions'

const definedProps = defineProps<{ data: ISideBarMenuItem[] }>()
const route = useRoute()
const opened = definedProps.data.findLast(value => checkActiveLink(route.path, { href: value.href, childs: value.childs }))
</script>

<template>
  <v-list density="compact" nav :aria-label="$t('mainMenu')" :opened="[opened ? `${opened.title}: ${opened.href}` : '']">
    <SideBarMenuItem v-for="item in data" :key="item.title" v-bind="item" />
  </v-list>
</template>
