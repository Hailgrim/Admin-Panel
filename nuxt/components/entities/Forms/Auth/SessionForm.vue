<script setup lang="ts">
import UAParser from 'ua-parser-js'

import Form from '~/components/shared/kit/Form/Form.vue'
import { useMainStore } from '~/store/main/main'
import authApi from '~/api/auth/authApi'
import type { ISession } from '~/api/auth/types'

const { session } = defineProps<{ session: ISession }>()
const emits = defineEmits(['delete'])

const { t, locale } = useI18n()
const mainStore = useMainStore()
const { data, error, execute, pending } = authApi.deleteSessions()
const rights = useRights(ROUTES.api.auth.profile)
const userAgent = ref(new UAParser(session.userAgent).getResult())

async function submitHandler() {
  execute([session.id])
}

watch(
  pending,
  () => {
    if (pending.value) return

    if (error.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(error.value, locale.value) })

    if (data.value) {
      emits('delete')
      mainStore.addAlert({ type: 'success', text: t('success') })
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <v-card class="mb-1 d-flex flex-row">
      <v-card-text class="d-flex flex-row align-center">
        <template v-if="userAgent.device.vendor">
          <v-icon class="mr-1" icon="mdi-cellphone" />
          <span class="text-body-2">
            {{ userAgent.device.vendor }}{{ ' ' }}
            {{ userAgent.device.model }}
            {{ ',' }}&nbsp;
          </span>
        </template>
        <template v-else>
          <v-icon class="mr-1" icon="mdi-laptop" />
          <span class="text-body-2">
            {{ userAgent.os.name }} {{ userAgent.os.version }}
            {{ ',' }}&nbsp;
          </span>
        </template>
        <span class="text-body-2">
          {{ userAgent.browser.name }} {{ userAgent.browser.version }}
          {{ ',' }}&nbsp;
        </span>
        <span class="text-body-2 opacity-80">
          {{ session.ip }}
          {{ ',' }}&nbsp;
        </span>
        <span class="text-body-2 opacity-60 mr-2">
          {{ makeDateString(session.updatedAt) }}
        </span>
        <v-chip v-if="session.current" color="success" variant="outlined">{{ $t('current') }}</v-chip>
      </v-card-text>
      <v-card-actions>
        <v-btn
color="error" :disabled="!rights.updating || pending || Boolean(data)" icon="mdi-delete" type="submit"
          variant="text" />
      </v-card-actions>
    </v-card>
  </Form>
</template>
