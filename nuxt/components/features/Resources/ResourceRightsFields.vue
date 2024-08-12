<script setup lang="ts">
import type { IResource, IRolesResources } from '~/api/resources/types'
import FormCheckbox from '~/components/shared/ui/Form/FormCheckbox.vue'

const { roleId, resource, rights } = defineProps<{ roleId: number, resource: IResource, rights?: IRolesResources }>()
const emit = defineEmits<{
  update: [value: IRolesResources]
}>()

const newRights = ref(rights || {
  roleId,
  resourceId: resource.id,
  creating: false,
  reading: false,
  updating: false,
  deleting: false,
})

function updateHandler(permisson: keyof Omit<IRolesResources, 'roleId' | 'resourceId'>, value: boolean) {
  newRights.value = { ...newRights.value, [permisson]: value }
  emit('update', newRights.value)
}
</script>

<template>
  <fieldset class="fieldset mr-6">
    <v-card-subtitle class="px-0 pt-0 pb-3" tag="legend">
      {{ resource.name }}
    </v-card-subtitle>
    <v-card-text class="px-0 pt-0 pb-3" tag="legend">
      {{ resource.description }}
    </v-card-text>
    <FormCheckbox
:label="$t('create')" :model-value="newRights.creating" :name="`${resource.name}.creating`"
      @update:model-value="updateHandler('creating', $event)" />
    <FormCheckbox
:label="$t('read')" :model-value="newRights.reading" :name="`${resource.name}.reading`"
      @update:model-value="updateHandler('reading', $event)" />
    <FormCheckbox
:label="$t('update')" :model-value="newRights.updating" :name="`${resource.name}.updating`"
      @update:model-value="updateHandler('updating', $event)" />
    <FormCheckbox
:label="$t('delete')" :model-value="newRights.deleting" :name="`${resource.name}.deleting`"
      @update:model-value="updateHandler('deleting', $event)" />
  </fieldset>
</template>

<style scoped lang="scss">
.fieldset {
  border-style: unset;
}
</style>
