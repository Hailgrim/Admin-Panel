<script setup lang="ts">
import FormCheckbox from '~/components/kit/Form/FormCheckbox.vue'
import type { IResource, IRolesResources } from '~/stores/resources/types';

const { roleId, resource, rights } = defineProps<{ roleId: number, resource: IResource, rights?: IRolesResources }>()
const emit = defineEmits(['update'])

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
    <v-card-subtitle tag="legend" class="px-0 pt-0 pb-3">
      {{ resource.name }}
    </v-card-subtitle>
    <v-card-text tag="legend" class="px-0 pt-0 pb-3">
      {{ resource.description }}
    </v-card-text>
    <FormCheckbox
:model-value="newRights.creating" :name="`${resource.name}.creating`" :label="$t('create')"
      @update:model-value="updateHandler('creating', $event)" />
    <FormCheckbox
:model-value="newRights.reading" :name="`${resource.name}.reading`" :label="$t('read')"
      @update:model-value="updateHandler('reading', $event)" />
    <FormCheckbox
:model-value="newRights.updating" :name="`${resource.name}.updating`" :label="$t('update')"
      @update:model-value="updateHandler('updating', $event)" />
    <FormCheckbox
:model-value="newRights.deleting" :name="`${resource.name}.deleting`" :label="$t('delete')"
      @update:model-value="updateHandler('deleting', $event)" />
  </fieldset>
</template>

<style scoped>
.fieldset {
  border-style: unset;
}
</style>
